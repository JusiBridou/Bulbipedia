import { z } from "zod";

export const updateMeSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z0-9_-]+$/, "username must contain only letters, numbers, _ and -")
      .optional(),
    avatarUrl: z.union([z.string().url().max(2048), z.null()]).optional()
  })
  .refine((input) => input.username !== undefined || input.avatarUrl !== undefined, {
    message: "At least one field must be provided"
  });
