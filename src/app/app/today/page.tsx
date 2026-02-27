import { getTodayWorkday } from "../actions";
import TodayClient from "./todayClient";

export default async function TodayPage() {
  const { dateStr, workday } = await getTodayWorkday();
  return <TodayClient dateStr={dateStr} workday={workday} />;
}
