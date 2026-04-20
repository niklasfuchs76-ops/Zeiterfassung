import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PLANS = [
  { tier: "FREE", price: "0 €", bullets: ["1 Brand", "1 Platform", "10 AI-Posts/Monat"] },
  {
    tier: "STARTER",
    price: "19 €/Monat",
    bullets: ["1 Brand", "3 Platforms", "100 AI-Posts/Monat"],
  },
  {
    tier: "PRO",
    price: "49 €/Monat",
    bullets: ["3 Brands", "Alle Platforms", "500 AI-Posts", "Analytics"],
    recommended: true,
  },
  {
    tier: "AGENCY",
    price: "149 €/Monat",
    bullets: ["10 Brands", "White-Label", "Team-Seats", "Priority-Support"],
  },
];

export default function BillingPage() {
  return (
    <div>
      <PageHeader
        title="Billing & Plan"
        description="Dein aktueller Plan, Nutzung des Monats, Upgrade-Optionen."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p) => (
          <Card key={p.tier} className={p.recommended ? "border-primary" : undefined}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {p.tier}
                {p.recommended && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    Empfohlen
                  </span>
                )}
              </CardTitle>
              <CardDescription>{p.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {p.bullets.map((b) => (
                  <li key={b}>· {b}</li>
                ))}
              </ul>
              <Button className="mt-4 w-full" variant={p.recommended ? "default" : "outline"}>
                {p.tier === "FREE" ? "Aktiv" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
