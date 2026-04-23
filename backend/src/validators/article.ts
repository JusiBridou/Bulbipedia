import { z } from "zod";

const formBoolean = z.preprocess((value) => {
  if (value === true || value === false) {
    return value;
  }

  if (typeof value === "string") {
    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }
  }

  return value;
}, z.boolean());

export const createArticleSchema = z.object({
  title: z.string().min(3).max(160),
  summary: z.string().max(280).optional(),
  content: z.string().min(50),
  heroImageUrl: z.string().url().max(2048).optional(),
  published: formBoolean.optional()
});

export const updateArticleSchema = z.object({
  title: z.string().min(3).max(160).optional(),
  summary: z.string().max(280).nullable().optional(),
  content: z.string().min(50).optional(),
  heroImageUrl: z.string().url().max(2048).nullable().optional(),
  published: formBoolean.optional()
});

export const rateArticleSchema = z.object({
  value: z.number().int().min(1).max(5)
});
