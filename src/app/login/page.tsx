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
        setMsg("Account erstellt. Falls E-Mail-Bestätigung aktiv ist, bitte Postfach prüfen.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMsg("Login erfolgreich.");
        window.location.href = "/app/today";
      }
    } catch (err: any) {
      setMsg(err?.message ?? "Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="card" style={{ maxWidth: 520, margin: "32px auto" }}>
        <h1 className="h1">Zeitstempel</h1>
        <p className="muted">Ein-/Ausstempeln, fixe Pause (60 min), automatische Plus/Minus Stunden.</p>
        <hr />
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="row">
            <button className={"btn " + (mode === "login" ? "" : "secondary")} onClick={() => setMode("login")} type="button">
              Login
            </button>
            <button className={"btn " + (mode === "signup" ? "" : "secondary")} onClick={() => setMode("signup")} type="button">
              Registrieren
            </button>
          </div>
        </div>
        <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
          <label className="muted">E-Mail</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <div style={{ height: 10 }} />
          <label className="muted">Passwort</label>
          <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          <div style={{ height: 14 }} />
          <button className="btn" disabled={loading} type="submit">
            {loading ? "…" : mode === "login" ? "Einloggen" : "Account erstellen"}
          </button>
        </form>
        {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      </div>
    </main>
  );
}
