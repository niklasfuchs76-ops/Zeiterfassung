import Link from "next/link";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    title: "Idea Engine",
    body: "Tägliche KI-Ideen, auf deine Marke, Pillars und Performance zugeschnitten.",
  },
  {
    title: "Content Studio",
    body: "Hook, Body, CTA, Hashtags und Visual-Prompt — plattformgenau, in Minuten.",
  },
  {
    title: "Smart Scheduler",
    body: "Kalender mit Drag & Drop. Auto-Posting für IG, LinkedIn, TikTok, X & mehr.",
  },
  {
    title: "Learning Loop",
    body: "Jeder Post macht den nächsten besser — Insights mit klaren Handlungen.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-br from-primary/30 via-fuchsia-500/20 to-transparent blur-3xl" />

      <header className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-fuchsia-500" />
          <span className="text-lg font-semibold">ContentFlow</span>
        </div>
        <nav className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Kostenlos starten</Link>
          </Button>
        </nav>
      </header>

      <section className="container pb-24 pt-16 text-center">
        <p className="mb-4 inline-flex items-center rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
          Alles-in-einem Social-Media-Workflow
        </p>
        <h1 className="mx-auto max-w-3xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
          Von der Idee zum Post.{" "}
          <span className="bg-gradient-to-r from-primary to-fuchsia-400 bg-clip-text text-transparent">
            Ohne Tool-Hopping.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
          ContentFlow führt Creator und kleine Teams in einem Tool durch Ideation, Creation,
          Scheduling, Auto-Posting und Analytics — mit einem Learning Loop, der jeden Post besser
          macht als den letzten.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/signup">Jetzt starten</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#features">So funktioniert&apos;s</Link>
          </Button>
        </div>
      </section>

      <section id="features" className="container grid gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm"
          >
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </section>

      <footer className="container border-t border-border/60 py-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} ContentFlow · Built with Claude
      </footer>
    </main>
  );
}
