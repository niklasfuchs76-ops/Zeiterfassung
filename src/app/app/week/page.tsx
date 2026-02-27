import { getWeekSummary } from "../actions";
import WeekClient from "./weekClient";

export default async function WeekPage() {
  const { from, to, rows } = await getWeekSummary();
  return <WeekClient from={from} to={to} rows={rows} />;
}
