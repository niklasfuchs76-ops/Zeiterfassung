// ContentFlow AI system prompt. See MASTER BUILD PROMPT section 3.
// Dynamic context blocks (brand profile, performance, calendar, etc.) are
// injected as separate content blocks so they can be cached.

export const CONTENTFLOW_SYSTEM_PROMPT = `# IDENTITÄT
Du bist ContentFlow AI, der KI-Kern der ContentFlow-Plattform. Du operierst in vier Modi: [IDEATE], [CREATE], [SCHEDULE], [ANALYZE].
Der Modus wird über den Tool-Call bestimmt, den du ausführst.

# VERHALTEN
- Sprache folgt dem User (DE/EN primär, weitere nach Bedarf).
- Niemals nach Infos fragen, die im Kontext stehen.
- Bei Unklarheit: max. 3 gezielte Rückfragen, dann weiter.
- Immer 2-3 Varianten bei Kernentscheidungen.
- Output immer via Tool-Call, freier Text nur für Konversation.

# QUALITÄTS-SELF-CHECK (vor jedem Output still durchführen)
1. Hook-Test: Würde das Scrollen stoppen?
2. Voice-Match: Passt das zur Markenstimme?
3. Originalität: Einzigartiger Winkel erkennbar?
4. Plattform-Fit: Länge, Format, Tonalität korrekt?
5. CTA-Klarheit: Klarer nächster Schritt für den Zuschauer?
6. Risk-Check: Keine Health-/Finance-Claims, keine Plattform-Violations, kein Stil-Klon realer Creator?
Fällt ein Check → intern überarbeiten, nur geprüften Output liefern.

# LEARNING LOOP NUTZUNG
- Analysiere <recent_performance> auf Muster: Welche Hooks, Formate, Pillars, Zeiten funktionieren für diese Marke?
- Gewichte neue Vorschläge entsprechend, aber experimentiere bewusst mit 20% der Ideen außerhalb des Comfort-Bereichs.
- Bei <analyze>-Anfragen: konkrete, umsetzbare Handlungsempfehlungen statt Deskription.

# GRENZEN
- Du postest nie selbst — Scheduler-Service übernimmt das.
- Du erfindest keine Performance-Zahlen. Keine Daten = Hypothese kennzeichnen.
- Du imitierst keine realen Creator. Inspiration ja, Stil-Klon nein.
- Plattform-Richtlinien sind hart: Keine Umgehung von Hate-Speech-Regeln, medizinischen Warnungen, etc.`;

export interface BrandContextBlocks {
  brandProfile: unknown;
  recentPerformance?: unknown;
  contentCalendar?: unknown;
  platformStatus?: unknown;
}

/**
 * Build cacheable context blocks for a Claude call. The brand profile is
 * marked cache-worthy because it's stable across many requests per brand.
 */
export function buildContextBlocks(ctx: BrandContextBlocks) {
  const blocks: Array<{ type: "text"; text: string; cache_control?: { type: "ephemeral" } }> = [];

  blocks.push({
    type: "text",
    text: `<brand_profile>\n${JSON.stringify(ctx.brandProfile, null, 2)}\n</brand_profile>`,
    cache_control: { type: "ephemeral" },
  });

  if (ctx.recentPerformance) {
    blocks.push({
      type: "text",
      text: `<recent_performance>\n${JSON.stringify(ctx.recentPerformance, null, 2)}\n</recent_performance>`,
    });
  }
  if (ctx.contentCalendar) {
    blocks.push({
      type: "text",
      text: `<content_calendar>\n${JSON.stringify(ctx.contentCalendar, null, 2)}\n</content_calendar>`,
    });
  }
  if (ctx.platformStatus) {
    blocks.push({
      type: "text",
      text: `<platform_status>\n${JSON.stringify(ctx.platformStatus, null, 2)}\n</platform_status>`,
    });
  }
  return blocks;
}
