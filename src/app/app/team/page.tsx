import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function TeamPage() {
  return (
    <div>
      <PageHeader
        title="Team"
        description="Mitglieder, Rollen (Owner · Admin · Editor · Viewer)."
        actions={<Button>Mitglied einladen</Button>}
      />
      <EmptyState
        title="Du bist (noch) allein"
        description="Lade Teammitglieder ein, um gemeinsam Posts zu entwerfen, freizugeben und zu planen."
      />
    </div>
  );
}
