// Tool definitions for Claude function calling. See MASTER BUILD PROMPT section 4.
// These are shared between API routes and the worker service. Input shapes
// are mirrored in zod schemas under `src/lib/ai/schemas.ts` for runtime validation.

import type Anthropic from "@anthropic-ai/sdk";

export const CONTENTFLOW_TOOLS: Anthropic.Tool[] = [
  {
    name: "generate_content_ideas",
    description:
      "Generiert Content-Ideen basierend auf Brand Profile und Performance-Daten. Nutze die letzten 60 Tage Performance als success/avoid patterns.",
    input_schema: {
      type: "object",
      properties: {
        count: { type: "integer", minimum: 1, maximum: 20 },
        platform: {
          type: "array",
          items: {
            type: "string",
            enum: ["INSTAGRAM", "LINKEDIN", "TIKTOK", "X", "FACEBOOK", "PINTEREST", "YOUTUBE"],
          },
        },
        pillar: { type: "string" },
        trendContext: { type: "string" },
        constraints: {
          type: "object",
          properties: {
            avoidTopics: { type: "array", items: { type: "string" } },
            focusFormat: {
              type: "string",
              enum: ["REEL", "CAROUSEL", "SINGLE_IMAGE", "THREAD", "SHORT_VIDEO", "STORY", "LONG_POST"],
            },
          },
        },
      },
      required: ["count", "platform"],
    },
  },
  {
    name: "draft_post",
    description: "Erstellt vollständigen Post aus einer akzeptierten Idee.",
    input_schema: {
      type: "object",
      properties: {
        ideaId: { type: "string" },
        platform: {
          type: "string",
          enum: ["INSTAGRAM", "LINKEDIN", "TIKTOK", "X", "FACEBOOK", "PINTEREST", "YOUTUBE"],
        },
        format: {
          type: "string",
          enum: ["REEL", "CAROUSEL", "SINGLE_IMAGE", "THREAD", "SHORT_VIDEO", "STORY", "LONG_POST"],
        },
        toneOverride: { type: "string" },
        includeVisualPrompt: { type: "boolean" },
      },
      required: ["ideaId", "platform", "format"],
    },
  },
  {
    name: "generate_visual_prompt",
    description: "Erzeugt optimierten Prompt für Bild-KI-Generator.",
    input_schema: {
      type: "object",
      properties: {
        postId: { type: "string" },
        styleRef: { type: "string" },
        aspectRatio: { type: "string", enum: ["1:1", "4:5", "9:16", "16:9"] },
        model: { type: "string", enum: ["flux", "sdxl", "dalle3"] },
      },
      required: ["postId", "aspectRatio"],
    },
  },
  {
    name: "suggest_schedule",
    description: "Schlägt optimale Posting-Zeitpunkte vor.",
    input_schema: {
      type: "object",
      properties: {
        postIds: { type: "array", items: { type: "string" } },
        strategy: { type: "string", enum: ["auto_optimize", "even_distribution", "specific_window"] },
        window: {
          type: "object",
          properties: {
            start: { type: "string", format: "date-time" },
            end: { type: "string", format: "date-time" },
          },
        },
        respectExistingSchedule: { type: "boolean" },
      },
      required: ["postIds", "strategy", "respectExistingSchedule"],
    },
  },
  {
    name: "analyze_performance",
    description: "Analysiert Post-Performance und generiert umsetzbare Insights.",
    input_schema: {
      type: "object",
      properties: {
        timeframe: { type: "string", enum: ["7d", "30d", "90d"] },
        platform: {
          type: "string",
          enum: ["INSTAGRAM", "LINKEDIN", "TIKTOK", "X", "FACEBOOK", "PINTEREST", "YOUTUBE"],
        },
        metricFocus: { type: "string", enum: ["engagement", "reach", "conversions"] },
      },
      required: ["timeframe"],
    },
  },
  {
    name: "recycle_content",
    description: "Wandelt erfolgreichen alten Content in neues Format um.",
    input_schema: {
      type: "object",
      properties: {
        sourcePostId: { type: "string" },
        targetPlatform: {
          type: "string",
          enum: ["INSTAGRAM", "LINKEDIN", "TIKTOK", "X", "FACEBOOK", "PINTEREST", "YOUTUBE"],
        },
        targetFormat: {
          type: "string",
          enum: ["REEL", "CAROUSEL", "SINGLE_IMAGE", "THREAD", "SHORT_VIDEO", "STORY", "LONG_POST"],
        },
        freshAngle: { type: "string" },
      },
      required: ["sourcePostId", "targetPlatform", "targetFormat"],
    },
  },
];

export type ToolName = (typeof CONTENTFLOW_TOOLS)[number]["name"];
