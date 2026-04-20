import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Willkommen zurück</h1>
          <p className="text-sm text-muted-foreground">Melde dich bei ContentFlow an.</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Noch kein Account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Registrieren
          </Link>
        </p>
      </div>
    </main>
  );
}
