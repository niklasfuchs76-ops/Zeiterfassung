"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { useEffect, useState } from "react";

type Profile = { full_name: string | null; email: string | null; role: "admin" | "member" };

export default function Nav() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase.from("profiles").select("full_name,email,role").eq("user_id", u.user.id).single();
      if (data) setProfile(data as any);
    })();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="nav">
      <Link href="/app/today" className="badge">Heute</Link>
      <Link href="/app/week" className="badge">Woche</Link>
      {profile?.role === "admin" && <Link href="/app/admin" className="badge">Admin</Link>}
      <span style={{ flex: 1 }} />
      {profile && <span className="muted">{profile.full_name || profile.email}</span>}
      <button className="btn secondary" onClick={logout} type="button">Logout</button>
    </div>
  );
}
