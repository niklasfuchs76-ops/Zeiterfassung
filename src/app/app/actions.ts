"use server";

import { createClient } from "@/lib/supabase/server";
import { TZ, todayDateStr, weekRangeFromDateStr } from "@/lib/time";

function serverTodayDateStr() {
  // Use Intl in server runtime as well
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  return fmt.format(new Date());
}

export async function getMe() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Not authenticated");
  return data.user;
}

export async function getTodayWorkday() {
  const supabase = createClient();
  const user = await getMe();
  const dateStr = serverTodayDateStr();

  const { data, error } = await supabase
    .from("workdays")
    .select("id, work_date, clock_in, clock_out, note")
    .eq("user_id", user.id)
    .eq("work_date", dateStr)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return { dateStr, workday: data ?? null };
}

export async function clockIn(note?: string) {
  const supabase = createClient();
  const user = await getMe();
  const dateStr = serverTodayDateStr();

  // Upsert: if row exists and clock_in already set -> reject
  const { data: existing, error: exErr } = await supabase
    .from("workdays")
    .select("id, clock_in, clock_out")
    .eq("user_id", user.id)
    .eq("work_date", dateStr)
    .maybeSingle();

  if (exErr) throw new Error(exErr.message);
  if (existing?.clock_in && !existing.clock_out) {
    throw new Error("Du bist bereits eingestempelt.");
  }
  if (existing?.clock_in && existing.clock_out) {
    throw new Error("Für heute existiert bereits ein abgeschlossener Eintrag. (MVP: 1 Eintrag/Tag)");
  }

  const now = new Date().toISOString();
  const { error } = await supabase.from("workdays").upsert({
    user_id: user.id,
    work_date: dateStr,
    clock_in: now,
    clock_out: null,
    note: note ?? null,
  }, { onConflict: "user_id,work_date" });

  if (error) throw new Error(error.message);
}

export async function clockOut() {
  const supabase = createClient();
  const user = await getMe();
  const dateStr = serverTodayDateStr();

  const { data: row, error: selErr } = await supabase
    .from("workdays")
    .select("id, clock_in, clock_out")
    .eq("user_id", user.id)
    .eq("work_date", dateStr)
    .single();

  if (selErr) throw new Error("Kein Eintrag für heute gefunden. Bitte zuerst einstempeln.");
  if (!row.clock_in) throw new Error("Kein clock_in gesetzt.");
  if (row.clock_out) throw new Error("Du bist bereits ausgestempelt.");

  const now = new Date().toISOString();
  const { error } = await supabase.from("workdays").update({ clock_out: now }).eq("id", row.id);
  if (error) throw new Error(error.message);
}

export async function getWeekSummary(dateStr?: string) {
  const supabase = createClient();
  const user = await getMe();
  const base = dateStr ?? serverTodayDateStr();
  const { from, to } = weekRangeFromDateStr(base);

  const { data, error } = await supabase.rpc("get_summary_secure", {
    p_user: user.id,
    p_from: from,
    p_to: to,
  });

  if (error) throw new Error(error.message);
  return { from, to, rows: data as any[] };
}

export async function getRangeSummary(from: string, to: string) {
  const supabase = createClient();
  const user = await getMe();
  const { data, error } = await supabase.rpc("get_summary_secure", {
    p_user: user.id,
    p_from: from,
    p_to: to,
  });
  if (error) throw new Error(error.message);
  return { from, to, rows: data as any[] };
}
