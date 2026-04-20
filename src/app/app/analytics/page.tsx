import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Performance-Dashboard & wöchentliche KI-Insights mit Handlungen."
      />
      <EmptyState
        title="Keine Daten"
        description="Sobald deine ersten Posts live sind, ziehen wir täglich Metriken und zeigen hier Trends, Top-Performer und Best-Times."
      />
    </div>
  );
}
