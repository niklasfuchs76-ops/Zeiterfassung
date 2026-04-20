import { z } from "zod";

export const platformEnum = z.enum([
  "INSTAGRAM",
  "LINKEDIN",
  "TIKTOK",
  "X",
  "FACEBOOK",
  "PINTEREST",
  "YOUTUBE",
]);

export const contentFormatEnum = z.enum([
  "REEL",
  "CAROUSEL",
  "SINGLE_IMAGE",
  "THREAD",
  "SHORT_VIDEO",
  "STORY",
  "LONG_POST",
]);

export const funnelStageEnum = z.enum(["TOFU", "MOFU", "BOFU"]);

export const generateContentIdeasInput = z.object({
  count: z.number().int().min(1).max(20),
  platform: z.array(platformEnum).min(1),
  pillar: z.string().optional(),
  trendContext: z.string().optional(),
  constraints: z
    .object({
      avoidTopics: z.array(z.string()).optional(),
      focusFormat: contentFormatEnum.optional(),
    })
    .optional(),
});
export type GenerateContentIdeasInput = z.infer<typeof generateContentIdeasInput>;

export const draftPostInput = z.object({
  ideaId: z.string(),
  platform: platformEnum,
  format: contentFormatEnum,
  toneOverride: z.string().optional(),
  includeVisualPrompt: z.boolean().optional(),
});
export type DraftPostInput = z.infer<typeof draftPostInput>;

export const generateVisualPromptInput = z.object({
  postId: z.string(),
  styleRef: z.string().optional(),
  aspectRatio: z.enum(["1:1", "4:5", "9:16", "16:9"]),
  model: z.enum(["flux", "sdxl", "dalle3"]).optional(),
});
export type GenerateVisualPromptInput = z.infer<typeof generateVisualPromptInput>;

export const suggestScheduleInput = z.object({
  postIds: z.array(z.string()).min(1),
  strategy: z.enum(["auto_optimize", "even_distribution", "specific_window"]),
  window: z
    .object({
      start: z.string().datetime(),
      end: z.string().datetime(),
    })
    .optional(),
  respectExistingSchedule: z.boolean(),
});
export type SuggestScheduleInput = z.infer<typeof suggestScheduleInput>;

export const analyzePerformanceInput = z.object({
  timeframe: z.enum(["7d", "30d", "90d"]),
  platform: platformEnum.optional(),
  metricFocus: z.enum(["engagement", "reach", "conversions"]).optional(),
});
export type AnalyzePerformanceInput = z.infer<typeof analyzePerformanceInput>;

export const recycleContentInput = z.object({
  sourcePostId: z.string(),
  targetPlatform: platformEnum,
  targetFormat: contentFormatEnum,
  freshAngle: z.string().optional(),
});
export type RecycleContentInput = z.infer<typeof recycleContentInput>;

export const contentIdeaOutput = z.object({
  hook: z.string(),
  format: contentFormatEnum,
  platformFit: z.array(platformEnum).min(1),
  pillar: z.string(),
  funnelStage: funnelStageEnum,
  effortScore: z.number().int().min(1).max(5),
  viralityPotential: z.number().int().min(1).max(5),
  rationale: z.string(),
});
export type ContentIdeaOutput = z.infer<typeof contentIdeaOutput>;
