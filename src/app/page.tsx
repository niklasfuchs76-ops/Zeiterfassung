"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Account erstellt. Falls E-Mail-Bestätigung aktiv ist: bitte Postfach prüfen.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/app/today";
      }
    } catch (err: any) {
      setMsg(err?.message ?? "Fehler");
    } finally {
      setLoading(false);
    }
  }

  const Tab = ({ v, label }: { v: "login" | "signup"; label: string }) => (
    <button
      type="button"
      onClick={() => setMode(v)}
      className={
        "rounded-full px-4 py-2 text-sm font-semibold transition " +
        (mode === v
          ? "bg-slate-900 text-white shadow"
          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50")
      }
    >
      {label}
    </button>
  );

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-900" />
              <div>
                <h1 className="text-2xl font-bold">Zeitstempel</h1>
                <p className="text-sm text-slate-500">Ein-/Ausstempeln · Pause 60 min · Plus/Minus automatisch</p>
              </div>
            </div>

            <div className="mt-8 flex gap-2">
              <Tab v="login" label="Login" />
              <Tab v="signup" label="Registrieren" />
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">E-Mail</label>
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-slate-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Passwort</label>
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
              </div>

              <button
                className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow hover:bg-slate-800 disabled:opacity-60"
                disabled={loading}
                type="submit"
              >
                {loading ? "…" : mode === "login" ? "Einloggen" : "Account erstellen"}
              </button>

              {msg && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {msg}
                </div>
              )}
            </form>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold">Wie es funktioniert</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-slate-900" />
                Ein-/Ausstempeln pro Tag (MVP: 1 Eintrag/Tag)
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-slate-900" />
                Pause wird immer automatisch mit 60 Minuten abgezogen
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-slate-900" />
                Sollzeit: Mo–Do 8:00, Fr 7:00 (netto)
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-slate-900" />
                Plus-/Minusstunden werden minutengenau berechnet
              </li>
            </ul>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5">
              <div className="text-sm font-semibold">Tipp</div>
              <div className="mt-1 text-sm text-slate-600">
                Wenn du Admin bist: in Supabase Tabelle <b>profiles</b> deine Rolle auf <b>admin</b> setzen.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
