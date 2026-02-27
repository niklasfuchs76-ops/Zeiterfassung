"use client";

import { formatTimeHHMM, minutesToHHMM } from "@/lib/time";

type Row = {
  work_date: string;
  clock_in: string | null;
  clock_out: string | null;
  net_work_minutes: number | null;
  required_minutes: number;
  diff_minutes: number | null;
};

export default function WeekClient({ from, to, rows }: { from: string; to: string; rows: Row[] }) {
  const totalDiff = rows.reduce((acc, r) => acc + (r.diff_minutes ?? 0), 0);
  const totalNet = rows.reduce((acc, r) => acc + (r.net_work_minutes ?? 0), 0);
  const totalReq = rows.reduce((acc, r) => acc + (r.required_minutes ?? 0), 0);

  return (
    <div className="card">
      <h1 className="h1">Woche ({from} – {to})</h1>
      <div className="row">
        <span className="badge">Netto: {minutesToHHMM(totalNet)}</span>
        <span className="badge">Soll: {minutesToHHMM(totalReq)}</span>
        <span className="badge">Saldo: {minutesToHHMM(totalDiff)}</span>
      </div>
      <hr />
      <table className="table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>In</th>
            <th>Out</th>
            <th>Netto</th>
            <th>Soll</th>
            <th>Diff</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.work_date}>
              <td>{r.work_date}</td>
              <td>{formatTimeHHMM(r.clock_in)}</td>
              <td>{formatTimeHHMM(r.clock_out)}</td>
              <td>{r.net_work_minutes == null ? "—" : minutesToHHMM(r.net_work_minutes)}</td>
              <td>{minutesToHHMM(r.required_minutes)}</td>
              <td>{r.diff_minutes == null ? "—" : minutesToHHMM(r.diff_minutes)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="muted" style={{ marginTop: 12 }}>
        “Saldo” ist die Summe der täglichen Differenzen (Netto − Soll). Positive Werte = Plusstunden, negative = Minusstunden.
      </p>
    </div>
  );
}
