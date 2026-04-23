import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth } from "../middleware/auth";
import { signAccessToken } from "../utils/jwt";
import { sendError } from "../utils/http";
import { loginSchema, registerSchema } from "../validators/auth";
import { deleteStoredImage, imageUpload, saveUploadedImage } from "../utils/uploads";

const authRouter = Router();

authRouter.post(
  "/register",
  imageUpload.single("avatarImage"),
  asyncHandler(async (req, res) => {
    const input = registerSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(input.password, 10);

    let uploadedAvatarPath: string | null = null;
    const avatarUrl = req.file
      ? ((uploadedAvatarPath = await saveUploadedImage(req.file, "avatar")), uploadedAvatarPath)
      : input.avatarUrl;

    try {
      const user = await prisma.user.create({
        data: {
          email: input.email.toLowerCase(),
          username: input.username,
          avatarUrl,
          passwordHash
        }
      });

      const token = signAccessToken({
        sub: user.id,
        role: user.role,
        email: user.email,
        username: user.username
      });

      return res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatarUrl: user.avatarUrl,
          role: user.role
        }
      });
    } catch (error) {
      if (uploadedAvatarPath) {
        await deleteStoredImage(uploadedAvatarPath);
      }

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2002"
      ) {
        return sendError(res, 409, "Email or username already exists");
      }

      throw error;
    }
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const input = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() }
    });

    if (!user) {
      return sendError(res, 401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      return sendError(res, 401, "Invalid credentials");
    }

    const token = signAccessToken({
      sub: user.id,
      role: user.role,
      email: user.email,
      username: user.username
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
        role: user.role
      }
    });
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    return res.json({ user });
  })
);

export default authRouter;
