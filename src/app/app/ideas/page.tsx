import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function IdeasPage() {
  return (
    <div>
      <PageHeader
        title="Ideas"
        description="KI-generierte Content-Ideen. Swipe accept / archive / edit."
        actions={<Button>Generate more</Button>}
      />
      <EmptyState
        title="Noch keine Ideen"
        description="Lege zuerst ein Brand Profile an und verbinde mindestens eine Plattform. Danach generiert die KI täglich 5–10 Ideen für dich."
        action={<Button variant="outline">Zum Brand Profile</Button>}
      />
    </div>
  );
}
