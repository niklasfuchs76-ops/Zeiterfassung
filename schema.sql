-- ZEITSTEMPEL: Minimal schema + RLS + helper RPCs
-- Run this in Supabase SQL editor.

-- 1) Profiles
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'member' check (role in ('admin','member')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_read_own" on public.profiles
  for select
  using (auth.uid() = user_id);

create policy "profiles_update_own_name" on public.profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admin can read all profiles
create policy "profiles_admin_read_all" on public.profiles
  for select
  using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin'));

create policy "profiles_admin_update_all" on public.profiles
  for update
  using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin'))
  with check (true);

-- Keep email in profiles synced (optional convenience)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 'member')
  on conflict (user_id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2) Workdays: one row per user per date (local date in Europe/Berlin)
create table if not exists public.workdays (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  work_date date not null,
  clock_in timestamptz,
  clock_out timestamptz,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workdays_one_per_day unique (user_id, work_date),
  constraint workdays_order check (clock_out is null or clock_in is null or clock_out >= clock_in)
);

create index if not exists workdays_user_date_idx on public.workdays(user_id, work_date);

alter table public.workdays enable row level security;

-- Members can CRUD their own rows
create policy "workdays_select_own" on public.workdays
  for select using (auth.uid() = user_id);

create policy "workdays_insert_own" on public.workdays
  for insert with check (auth.uid() = user_id);

create policy "workdays_update_own" on public.workdays
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "workdays_delete_own" on public.workdays
  for delete using (auth.uid() = user_id);

-- Admin can read all workdays (for support)
create policy "workdays_admin_read_all" on public.workdays
  for select using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- Update updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists workdays_set_updated_at on public.workdays;
create trigger workdays_set_updated_at
  before update on public.workdays
  for each row execute procedure public.set_updated_at();

-- 3) Rules (single row)
create table if not exists public.work_rules (
  id int primary key default 1,
  break_minutes int not null default 60 check (break_minutes between 0 and 240),
  mon_thu_required_minutes int not null default 480, -- 8:00
  fri_required_minutes int not null default 420,     -- 7:00
  tz text not null default 'Europe/Berlin',
  updated_at timestamptz not null default now()
);

insert into public.work_rules (id) values (1)
on conflict (id) do nothing;

alter table public.work_rules enable row level security;

-- Everyone can read rules
create policy "rules_read_all" on public.work_rules
  for select using (true);

-- Only admin can update rules
create policy "rules_admin_update" on public.work_rules
  for update using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  ) with check (true);

-- 4) Helper: required minutes for a date
create or replace function public.required_minutes_for_date(d date)
returns int
language sql
stable
as $$
  select case
    when extract(isodow from d) between 1 and 4 then (select mon_thu_required_minutes from public.work_rules where id=1)
    when extract(isodow from d) = 5 then (select fri_required_minutes from public.work_rules where id=1)
    else 0
  end;
$$;

-- 5) Helper: compute net worked minutes for a row (fixed break)
create or replace function public.net_minutes(clock_in timestamptz, clock_out timestamptz)
returns int
language plpgsql
stable
as $$
declare
  brk int := (select break_minutes from public.work_rules where id=1);
  mins int;
begin
  if clock_in is null or clock_out is null then
    return null;
  end if;

  mins := floor(extract(epoch from (clock_out - clock_in)) / 60);
  mins := greatest(mins - brk, 0);
  return mins;
end;
$$;

-- 6) RPC: summary for a user between dates (inclusive)
create or replace function public.get_summary(p_user uuid, p_from date, p_to date)
returns table (
  work_date date,
  clock_in timestamptz,
  clock_out timestamptz,
  net_work_minutes int,
  required_minutes int,
  diff_minutes int
)
language sql
security definer
set search_path = public
as $$
  select
    d::date as work_date,
    w.clock_in,
    w.clock_out,
    public.net_minutes(w.clock_in, w.clock_out) as net_work_minutes,
    public.required_minutes_for_date(d::date) as required_minutes,
    case
      when w.clock_in is null or w.clock_out is null then null
      else public.net_minutes(w.clock_in, w.clock_out) - public.required_minutes_for_date(d::date)
    end as diff_minutes
  from generate_series(p_from, p_to, interval '1 day') as d
  left join public.workdays w
    on w.user_id = p_user and w.work_date = d::date
  order by d;
$$;

-- IMPORTANT: Restrict RPC usage: only self or admin
revoke all on function public.get_summary(uuid,date,date) from public;
grant execute on function public.get_summary(uuid,date,date) to authenticated;

create or replace function public.can_access_user(target_user uuid)
returns boolean
language sql
stable
as $$
  select (auth.uid() = target_user)
    or exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin');
$$;

-- Wrap summary with access check (preferred)
create or replace function public.get_summary_secure(p_user uuid, p_from date, p_to date)
returns table (
  work_date date,
  clock_in timestamptz,
  clock_out timestamptz,
  net_work_minutes int,
  required_minutes int,
  diff_minutes int
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.can_access_user(p_user) then
    raise exception 'not allowed';
  end if;

  return query
    select * from public.get_summary(p_user, p_from, p_to);
end;
$$;

revoke all on function public.get_summary_secure(uuid,date,date) from public;
grant execute on function public.get_summary_secure(uuid,date,date) to authenticated;
