"use client";

import { createClient } from "@/lib/supabase/browser";
import { useState } from "react";

type P = { user_id: string; email: string | null; full_name: string | null; role: "admin" | "member"; created_at: string };

export default function AdminClient({ users }: { users: P[] }) {
  const supabase = createClient();
  const [msg, setMsg] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setRole(userId: string, role: "admin" | "member") {
    setBusyId(userId); setMsg(null);
    const { error } = await supabase.from("profiles").update({ role }).eq("user_id", userId);
    if (error) setMsg(error.message);
    else {
      setMsg("Rolle aktualisiert. Seite neu laden…");
      window.location.reload();
    }
    setBusyId(null);
  }

  return (
    <div className="card">
      <h1 className="h1">Admin</h1>
      <p className="muted">Hier kannst du Rollen setzen (Admin/Member). Accounts werden über den Login-Screen erstellt.</p>
      {msg && <p>{msg}</p>}
      <hr />
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>E-Mail</th>
            <th>Rolle</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.user_id}>
              <td>{u.full_name || "—"}</td>
              <td>{u.email || "—"}</td>
              <td><span className="badge">{u.role}</span></td>
              <td className="row">
                <button className="btn secondary" disabled={busyId===u.user_id} onClick={() => setRole(u.user_id, "member")} type="button">Member</button>
                <button className="btn" disabled={busyId===u.user_id} onClick={() => setRole(u.user_id, "admin")} type="button">Admin</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
