// ContentFlow worker service — runs outside Next.js (Railway/Fly.io).
// Handles: scheduled posting, metrics fetching, daily idea/insight generation.
// See MASTER BUILD PROMPT section 7.4.

import { Worker } from "bullmq";
import IORedis from "ioredis";
import { QUEUE_NAMES } from "../src/lib/queue";

const url = process.env.REDIS_URL;
if (!url) {
  console.error("[worker] REDIS_URL is not set — exiting");
  process.exit(1);
}

const connection = new IORedis(url, { maxRetriesPerRequest: null });

// Scheduled post worker — minute-resolution dispatch via delayed jobs.
// Actual platform adapter logic will land alongside Phase 1 platform code.
const scheduleWorker = new Worker(
  QUEUE_NAMES.schedulePost,
  async (job) => {
    console.log("[schedule-post] picked up", job.id, job.data);
    // TODO: load post + connection, decrypt token, call adapter.post()
    // TODO: on success update ScheduledPost.status = POSTED; on failure retry w/ backoff.
  },
  { connection, concurrency: 4 },
);

const metricsWorker = new Worker(
  QUEUE_NAMES.fetchMetrics,
  async (job) => {
    console.log("[fetch-metrics] picked up", job.id, job.data);
    // TODO: for each POSTED post <30d old, call adapter.getMetrics() and upsert PostMetrics.
  },
  { connection, concurrency: 2 },
);

const ideasWorker = new Worker(
  QUEUE_NAMES.generateIdeas,
  async (job) => {
    console.log("[generate-ideas] picked up", job.id, job.data);
    // TODO: run generate_content_ideas tool for the given brand.
  },
  { connection, concurrency: 2 },
);

const insightsWorker = new Worker(
  QUEUE_NAMES.generateInsights,
  async (job) => {
    console.log("[generate-insights] picked up", job.id, job.data);
    // TODO: run analyze_performance tool for the given brand.
  },
  { connection, concurrency: 1 },
);

for (const w of [scheduleWorker, metricsWorker, ideasWorker, insightsWorker]) {
  w.on("failed", (job, err) => {
    console.error(`[worker:${w.name}] job ${job?.id} failed`, err);
  });
}

console.log("[worker] contentflow workers started");

function shutdown() {
  console.log("[worker] shutting down");
  Promise.all([
    scheduleWorker.close(),
    metricsWorker.close(),
    ideasWorker.close(),
    insightsWorker.close(),
  ])
    .then(() => connection.quit())
    .finally(() => process.exit(0));
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
