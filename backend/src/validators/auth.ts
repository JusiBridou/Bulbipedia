import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, "username must contain only letters, numbers, _ and -"),
  password: z.string().min(8).max(100),
  avatarUrl: z.string().url().max(2048).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100)
});
