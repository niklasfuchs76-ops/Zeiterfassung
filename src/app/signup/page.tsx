import Link from "next/link";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Account erstellen</h1>
          <p className="text-sm text-muted-foreground">
            Starte kostenlos. Kein Credit-Card, keine Tricks.
          </p>
        </div>
        <SignupForm />
        <p className="text-center text-sm text-muted-foreground">
          Schon registriert?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Anmelden
          </Link>
        </p>
      </div>
    </main>
  );
}
