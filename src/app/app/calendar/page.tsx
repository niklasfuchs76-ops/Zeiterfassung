import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export default function CalendarPage() {
  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Kalender-Ansicht mit Drag & Drop. Queue-Slots & Bulk-Scheduling."
      />
      <EmptyState
        title="Kalender leer"
        description="Sobald Posts geplant sind, erscheinen sie hier. Der Scheduler postet automatisch zum geplanten Zeitpunkt."
      />
    </div>
  );
}
