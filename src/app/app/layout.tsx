import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/server";

const NAV = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/ideas", label: "Ideas" },
  { href: "/app/create", label: "Create" },
  { href: "/app/calendar", label: "Calendar" },
  { href: "/app/library", label: "Library" },
  { href: "/app/analytics", label: "Analytics" },
  { href: "/app/brand", label: "Brand" },
  { href: "/app/connections", label: "Connections" },
  { href: "/app/team", label: "Team" },
  { href: "/app/billing", label: "Billing" },
  { href: "/app/settings", label: "Settings" },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const user = supabaseConfigured ? await getSessionUser() : null;
  if (supabaseConfigured && !user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-card/40 p-4 md:block">
        <Link href="/app/dashboard" className="mb-6 flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-primary to-fuchsia-500" />
          <span className="font-semibold">ContentFlow</span>
        </Link>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          {user?.email ?? "preview mode — Supabase not configured"}
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
