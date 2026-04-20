import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PLATFORMS = [
  { id: "INSTAGRAM", label: "Instagram", status: "MVP" },
  { id: "LINKEDIN", label: "LinkedIn", status: "MVP" },
  { id: "TIKTOK", label: "TikTok", status: "Phase 2" },
  { id: "X", label: "X", status: "Phase 2" },
  { id: "FACEBOOK", label: "Facebook", status: "Phase 2" },
  { id: "PINTEREST", label: "Pinterest", status: "Phase 2" },
  { id: "YOUTUBE", label: "YouTube Shorts", status: "Phase 3" },
];

export default function ConnectionsPage() {
  return (
    <div>
      <PageHeader
        title="Platform Connections"
        description="OAuth-verbundene Accounts. Tokens werden AES-256-GCM verschlüsselt gespeichert."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORMS.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {p.label}
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {p.status}
                </span>
              </CardTitle>
              <CardDescription>Nicht verbunden</CardDescription>
            </CardHeader>
            <div className="p-6 pt-0">
              <Button variant="outline" className="w-full" disabled>
                Connect
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
