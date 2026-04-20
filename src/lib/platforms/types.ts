import type { PlatformConnection, Post } from "@prisma/client";

export interface PostResult {
  platformPostId: string;
  platformUrl: string;
  postedAt: Date;
}

export interface Metrics {
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  raw?: unknown;
}

export interface RefreshedTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface PlatformAdapter {
  platform: PlatformConnection["platform"];
  post(post: Post, connection: PlatformConnection): Promise<PostResult>;
  getMetrics(platformPostId: string, connection: PlatformConnection): Promise<Metrics>;
  refreshToken(connection: PlatformConnection): Promise<RefreshedTokens>;
}
