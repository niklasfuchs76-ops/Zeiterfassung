import { Queue, type QueueOptions } from "bullmq";
import IORedis from "ioredis";

// BullMQ connection. Uses REDIS_URL for the Node worker (not Upstash REST).

let _connection: IORedis | null = null;

function getConnection(): IORedis {
  if (_connection) return _connection;
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL is not set (required for BullMQ)");
  _connection = new IORedis(url, { maxRetriesPerRequest: null });
  return _connection;
}

export const QUEUE_NAMES = {
  schedulePost: "schedule-post",
  fetchMetrics: "fetch-metrics",
  generateIdeas: "generate-ideas",
  generateInsights: "generate-insights",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

const queues = new Map<string, Queue>();

export function getQueue(name: QueueName, opts?: Partial<QueueOptions>): Queue {
  const cached = queues.get(name);
  if (cached) return cached;
  const q = new Queue(name, { connection: getConnection(), ...opts });
  queues.set(name, q);
  return q;
}
