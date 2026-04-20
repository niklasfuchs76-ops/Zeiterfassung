import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function CreatePage() {
  return (
    <div>
      <PageHeader
        title="Content Studio"
        description="3-Spalten-Editor: Inhalt · Live-Preview pro Plattform · KI-Assistent."
      />
      <EmptyState
        title="Keine Drafts geöffnet"
        description="Starte aus einer akzeptierten Idee, oder beginne einen leeren Post."
        action={<Button>Leeren Post starten</Button>}
      />
    </div>
  );
}
