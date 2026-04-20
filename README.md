# ContentFlow

All-in-One Social Media Content Management Platform — AI-powered workflow from
ideation to insight. See [the master build spec](#build-plan) for the full
feature scope.

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript (strict), Tailwind CSS,
  shadcn-style Radix primitives, TanStack Query, Zustand, react-hook-form + zod.
- **Backend:** Next.js API routes + a separate Node worker service (BullMQ +
  Redis + ioredis). Prisma ORM.
- **Data & Storage:** PostgreSQL (Supabase), Redis (Upstash REST for serverless,
  ioredis for the worker), Supabase Storage / S3 for media.
- **Auth & Security:** Supabase Auth, Row-Level Security, AES-256-GCM token
  envelope, Upstash Ratelimit per tier.
- **AI:** Anthropic Claude (Sonnet 4.6 generation, Haiku 4.5 fast tasks) with
  tool-calling and prompt caching on brand-profile context. Replicate for
  image generation.

## Repo layout

```
contentflow/
├── prisma/
│   └── schema.prisma        # full data model (users, orgs, brands, posts, ...)
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # landing
│   │   ├── login/ signup/ onboarding/
│   │   ├── app/             # authenticated app (dashboard, ideas, create, ...)
│   │   └── api/             # Next.js API routes (sync endpoints)
│   ├── components/          # shared + shadcn-style UI primitives
│   ├── lib/
│   │   ├── ai/              # system prompt, tool defs, zod schemas
│   │   ├── platforms/       # per-platform adapters (IG/LinkedIn/...)
│   │   ├── supabase/        # server/client/middleware wrappers
│   │   ├── db.ts            # Prisma client singleton
│   │   ├── encryption.ts    # AES-256-GCM token envelope
│   │   ├── queue.ts         # BullMQ queue accessors
│   │   ├── rate-limit.ts    # per-tier Upstash limiters
│   │   └── redis.ts         # Upstash Redis accessor
│   ├── middleware.ts        # Supabase session refresh
│   └── env.ts               # zod-validated env
└── worker/
    └── index.ts             # BullMQ worker service (deploy to Railway/Fly.io)
```

## Getting started

```bash
cp .env.example .env.local          # fill in Supabase + DB + Anthropic keys
npm install
npx prisma generate
npx prisma migrate dev              # requires a reachable DATABASE_URL
npm run dev                         # http://localhost:3000
```

Generate an encryption key for platform OAuth tokens:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run the worker service in a second shell:

```bash
npm run worker:dev
```

## Scripts

| command | description |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next lint |
| `npm run prisma:generate` | Regenerate Prisma Client |
| `npm run prisma:migrate` | Run dev migrations |
| `npm run worker:dev` | Worker with hot reload |

## Build plan

Roadmap from the master spec:

- **Phase 1 (MVP, weeks 1–8):** auth, onboarding, brand profile, idea engine,
  content creator (text + hashtags), calendar + scheduler, auto-posting for
  Instagram + LinkedIn, basic analytics, Stripe billing. _← current focus_
- **Phase 2 (weeks 9–16):** TikTok/X/Facebook/Pinterest, image gen, carousels,
  bulk gen, trend integration, approval workflows, recycling.
- **Phase 3 (weeks 17–24):** YouTube Shorts, video gen, voice-over, competitor
  tracking, A/B testing, white-label, Chrome extension, mobile app.

## Status

Step 1 of the build plan is complete: Next.js + TS + Tailwind + Prisma +
Supabase scaffold, with the full data model, AI tool defs, platform-adapter
contract, worker skeleton, and a functional auth + app shell.

Not yet implemented (next steps): migrations run against a real DB, auth
callback/middleware testing, the onboarding wizard, the idea engine, the
content studio, OAuth integrations, and the posting worker adapters.
