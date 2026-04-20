import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(3).max(160),
  summary: z.string().max(280).optional(),
  content: z.string().min(50),
  heroImageUrl: z.string().url().max(2048).optional(),
  published: z.boolean().optional()
});

export const updateArticleSchema = z.object({
  title: z.string().min(3).max(160).optional(),
  summary: z.string().max(280).nullable().optional(),
  content: z.string().min(50).optional(),
  heroImageUrl: z.string().url().max(2048).nullable().optional(),
  published: z.boolean().optional()
});

export const rateArticleSchema = z.object({
  value: z.number().int().min(1).max(5)
});
