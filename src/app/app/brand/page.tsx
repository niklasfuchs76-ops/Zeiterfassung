import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function BrandPage() {
  return (
    <div>
      <PageHeader
        title="Brand Profile"
        description="Nische, Zielgruppe, Voice, Pillars, Posting-Frequenz."
      />
      <EmptyState
        title="Noch kein Brand Profile"
        description="Starte das KI-geführte Onboarding-Interview — dauert etwa 5 Minuten."
        action={<Button>Onboarding starten</Button>}
      />
    </div>
  );
}
