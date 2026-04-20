import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <main className="container max-w-2xl py-12">
      <PageHeader
        title="Willkommen bei ContentFlow"
        description="KI-geführtes Brand-Interview — 7 Schritte, ca. 5 Minuten."
      />
      <EmptyState
        title="Bereit, dein Brand Profile anzulegen?"
        description="Wir stellen dir ein paar Fragen zu Nische, Zielgruppe, Voice und Pillars. Danach generiert die KI deine ersten Ideen."
        action={<Button>Interview starten</Button>}
      />
    </main>
  );
}
