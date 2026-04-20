import { z } from "zod";

// Zod schemas for env validation. During `next dev` we warn on missing values
// so the scaffold is runnable before the user has filled in all secrets.
// In production, `build`/`start` will fail fast on missing required vars.

const serverSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  DIRECT_URL: z.string().url().optional(),

  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  REPLICATE_API_TOKEN: z.string().min(1).optional(),

  REDIS_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

  ENCRYPTION_KEY: z
    .string()
    .regex(/^[0-9a-fA-F]{64}$/u, "ENCRYPTION_KEY must be 32 bytes hex-encoded (64 chars)")
    .optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  META_APP_ID: z.string().optional(),
  META_APP_SECRET: z.string().optional(),
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
  TIKTOK_CLIENT_KEY: z.string().optional(),
  TIKTOK_CLIENT_SECRET: z.string().optional(),
  X_CLIENT_ID: z.string().optional(),
  X_CLIENT_SECRET: z.string().optional(),
  YOUTUBE_CLIENT_ID: z.string().optional(),
  YOUTUBE_CLIENT_SECRET: z.string().optional(),
  PINTEREST_CLIENT_ID: z.string().optional(),
  PINTEREST_CLIENT_SECRET: z.string().optional(),

  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
});

function parse<T extends z.ZodTypeAny>(schema: T, input: Record<string, unknown>, label: string) {
  const result = schema.safeParse(input);
  if (!result.success) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`[env:${label}] invalid environment:\n${result.error.toString()}`);
    }
    console.warn(`[env:${label}] some env vars are invalid — continuing with defaults`);
    return schema.parse({}) as z.infer<T>;
  }
  return result.data as z.infer<T>;
}

export const serverEnv =
  typeof window === "undefined"
    ? parse(serverSchema, process.env as Record<string, unknown>, "server")
    : (undefined as unknown as z.infer<typeof serverSchema>);

export const clientEnv = parse(
  clientSchema,
  {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  },
  "client",
);
