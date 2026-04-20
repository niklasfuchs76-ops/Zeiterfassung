import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export default function LibraryPage() {
  return (
    <div>
      <PageHeader title="Library" description="Alle Posts — filterbar, wiederverwendbar." />
      <EmptyState
        title="Noch keine Posts"
        description="Deine erstellten und veröffentlichten Posts sammeln sich hier. Top-Performer kannst du 1-Klick in neue Formate recyclen."
      />
    </div>
  );
}
