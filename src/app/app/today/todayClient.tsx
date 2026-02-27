"use client";

import { useEffect, useMemo, useState } from "react";
import { clockIn, clockOut } from "../actions";
import { formatTimeHHMM, minutesToHHMM } from "@/lib/time";

type Workday = {
  id: number;
  work_date: string;
  clock_in: string | null;
  clock_out: string | null;
  note: string | null;
} | null;

const BREAK_MINUTES = 60;

function computeLiveNetMinutes(clockInIso: string) {
  const start = new Date(clockInIso).getTime();
  const now = Date.now();
  const mins = Math.floor((now - start) / 60000);
  return Math.max(mins - BREAK_MINUTES, 0);
}

function requiredForDate(dateStr: string) {
  // YYYY-MM-DD -> iso weekday approximation
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const day = dt.getUTCDay(); // 0 Sun .. 6 Sat
  const isoDow = day === 0 ? 7 : day;
  if (isoDow >= 1 && isoDow <= 4) return 480;
  if (isoDow === 5) return 420;
  return 0;
}

export default function TodayClient({ dateStr, workday }: { dateStr: string; workday: Workday }) {
  const [note, setNote] = useState(workday?.note ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveNet, setLiveNet] = useState<number | null>(null);

  const isIn = !!workday?.clock_in && !workday?.clock_out;
  const isDone = !!workday?.clock_in && !!workday?.clock_out;

  const required = useMemo(() => requiredForDate(dateStr), [dateStr]);

  useEffect(() => {
    if (!isIn || !workday?.clock_in) {
      setLiveNet(null);
      return;
    }
    const tick = () => setLiveNet(computeLiveNetMinutes(workday.clock_in!));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, [isIn, workday?.clock_in]);

  async function onIn() {
    setBusy(true); setError(null);
    try {
      await clockIn(note || undefined);
      window.location.reload();
    } catch (e: any) {
      setError(e?.message ?? "Fehler");
    } finally {
      setBusy(false);
    }
  }

  async function onOut() {
    setBusy(true); setError(null);
    try {
      await clockOut();
      window.location.reload();
    } catch (e: any) {
      setError(e?.message ?? "Fehler");
    } finally {
      setBusy(false);
    }
  }

  const clockInStr = formatTimeHHMM(workday?.clock_in ?? null);
  const clockOutStr = formatTimeHHMM(workday?.clock_out ?? null);

  let netMinutes: number | null = null;
  if (isDone && workday?.clock_in && workday?.clock_out) {
    const mins = Math.floor((new Date(workday.clock_out).getTime() - new Date(workday.clock_in).getTime()) / 60000);
    netMinutes = Math.max(mins - BREAK_MINUTES, 0);
  } else if (isIn && liveNet != null) {
    netMinutes = liveNet;
  }

  const diff = netMinutes == null ? null : netMinutes - required;

  return (
    <div className="card">
      <h1 className="h1">Heute ({dateStr})</h1>
      <div className="row">
        <span className="badge">Pause: 1:00 (automatisch)</span>
        <span className="badge">Soll: {minutesToHHMM(required)}</span>
        {diff != null && <span className="badge">Diff: {minutesToHHMM(diff)}</span>}
      </div>

      <hr />

      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <div className="muted">Status</div>
          <div className="kpi">{isIn ? "Eingestempelt" : isDone ? "Fertig" : "Ausgestempelt"}</div>
        </div>
        <div>
          <div className="muted">Stempelzeiten</div>
          <div style={{ fontSize: 18 }}>
            {clockInStr ? `In: ${clockInStr}` : "In: —"}{"  "}
            {clockOutStr ? `Out: ${clockOutStr}` : "Out: —"}
          </div>
        </div>
      </div>

      <div style={{ height: 14 }} />

      {!isDone && (
        <div className="row">
          {!isIn ? (
            <button className="btn" onClick={onIn} disabled={busy}>Einstempeln</button>
          ) : (
            <button className="btn" onClick={onOut} disabled={busy}>Ausstempeln</button>
          )}
          <div style={{ flex: 1, minWidth: 240 }}>
            <input className="input" placeholder="Notiz (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
      )}

      {netMinutes != null && (
        <p style={{ marginTop: 12 }} className="muted">
          Netto bisher: <b>{minutesToHHMM(netMinutes)}</b> (Pause bereits abgezogen)
        </p>
      )}

      {error && <p style={{ marginTop: 12 }}>{error}</p>}

      <p style={{ marginTop: 12 }} className="muted">
        Hinweis (MVP): Pro Tag ist aktuell 1 Eintrag vorgesehen. Das passt zu “rein stempeln”.
      </p>
    </div>
  );
}
