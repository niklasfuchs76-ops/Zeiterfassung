import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

const STATS = [
  { label: "Upcoming posts", value: "—" },
  { label: "Posts last 7 days", value: "—" },
  { label: "Avg. engagement", value: "—" },
  { label: "AI calls today", value: "—" },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Dein Überblick: anstehende Posts, Performance, KI-Vorschläge."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-2xl">{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
            <CardDescription>Nächste 7 Tage, alle Plattformen.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Noch keine Posts geplant. Erstelle deinen ersten im Ideas- oder Create-Bereich.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>KI-Vorschläge</CardTitle>
            <CardDescription>Wöchentliche Insights aus deinen Daten.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Sobald du ~10 Posts veröffentlicht hast, erscheinen hier erste datengetriebene Hinweise.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
