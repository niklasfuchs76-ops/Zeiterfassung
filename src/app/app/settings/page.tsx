import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Profil, Sprache, Benachrichtigungen, Datenexport." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>E-Mail, Name, Avatar.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Kommt bald.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>GDPR</CardTitle>
            <CardDescription>Datenexport & Account-Löschung.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Kommt bald.</CardContent>
        </Card>
      </div>
    </div>
  );
}
