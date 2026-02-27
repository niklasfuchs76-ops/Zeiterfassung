export const TZ = "Europe/Berlin";

export function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export function minutesToHHMM(mins: number) {
  const sign = mins < 0 ? "-" : "";
  const abs = Math.abs(mins);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${h}:${pad2(m)}`;
}

// Returns YYYY-MM-DD in Europe/Berlin for "today"
export function todayDateStr() {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  return fmt.format(new Date()); // en-CA -> YYYY-MM-DD
}

export function dateStrFor(d: Date) {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  return fmt.format(d);
}

// ISO week start (Monday) for a given date (based on TZ date, not UTC)
export function weekRangeFromDateStr(dateStr: string) {
  // dateStr: YYYY-MM-DD assumed local tz date
  const [y, m, d] = dateStr.split("-").map(Number);
  // create a Date at noon UTC to avoid DST edge issues; then treat as local via calculations below
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  // We approximate weekday via ISO using UTC; for Berlin date it matches for noon safely.
  const day = dt.getUTCDay(); // 0=Sun..6=Sat
  const isoDow = day === 0 ? 7 : day; // 1..7
  const monday = new Date(dt);
  monday.setUTCDate(dt.getUTCDate() - (isoDow - 1));
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const from = dateStrFor(monday);
  const to = dateStrFor(sunday);
  return { from, to };
}

export function formatTimeHHMM(ts?: string | null) {
  if (!ts) return "";
  const d = new Date(ts);
  const fmt = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
  return fmt.format(d);
}
