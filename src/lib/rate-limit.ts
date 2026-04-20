import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "./redis";

// Plan-tier → daily AI-call budget. See MASTER BUILD PROMPT section 9.
const TIER_LIMITS: Record<string, number> = {
  FREE: 100,
  STARTER: 500,
  PRO: 1000,
  AGENCY: 10_000,
};

const cache = new Map<string, Ratelimit>();

export function getAiRateLimiter(tier: keyof typeof TIER_LIMITS | string) {
  const quota = TIER_LIMITS[tier] ?? TIER_LIMITS.FREE;
  const cached = cache.get(tier);
  if (cached) return cached;
  const limiter = new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.fixedWindow(quota, "1 d"),
    prefix: `cf:ai:${tier}`,
    analytics: true,
  });
  cache.set(tier, limiter);
  return limiter;
}
