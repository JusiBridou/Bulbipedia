import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth } from "../middleware/auth";
import { sendError } from "../utils/http";
import { updateMeSchema } from "../validators/user";
import { deleteStoredImage, imageUpload, saveUploadedImage } from "../utils/uploads";

const userRouter = Router();

userRouter.patch(
  "/me",
  requireAuth,
  imageUpload.single("avatarImage"),
  asyncHandler(async (req, res) => {
    const input = updateMeSchema.parse(req.body);
    let uploadedAvatarPath: string | null = null;

    if (!req.file && input.username === undefined && input.avatarUrl === undefined) {
      return sendError(res, 400, "At least one field must be provided");
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { avatarUrl: true }
    });

    const previousAvatarUrl = existingUser?.avatarUrl ?? null;

    const nextAvatarUrl = req.file
      ? ((uploadedAvatarPath = await saveUploadedImage(req.file, "avatar")), uploadedAvatarPath)
      : input.avatarUrl !== undefined
        ? input.avatarUrl
        : existingUser?.avatarUrl ?? null;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          ...(input.username !== undefined ? { username: input.username } : {}),
          ...(req.file || input.avatarUrl !== undefined ? { avatarUrl: nextAvatarUrl } : {})
        },
        select: {
          id: true,
          email: true,
          username: true,
          avatarUrl: true,
          role: true,
          createdAt: true
        }
      });

      if ((req.file || input.avatarUrl !== undefined) && previousAvatarUrl && previousAvatarUrl !== nextAvatarUrl) {
        await deleteStoredImage(previousAvatarUrl);
      }

      return res.json({ user: updatedUser });
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
        return sendError(res, 409, "Username already exists");
      }

      throw error;
    }
  })
);

userRouter.get(
  "/:username",
  asyncHandler(async (req, res) => {
    const username = String(req.params.username ?? "").trim();
    if (!username) {
      return sendError(res, 400, "Username is required");
    }

    const user = await prisma.user.findFirst({
      where: { username: { equals: username, mode: "insensitive" } },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
        articles: {
          where: { published: true },
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          select: {
            id: true,
            slug: true,
            title: true,
            summary: true,
            publishedAt: true,
            updatedAt: true,
            _count: { select: { ratings: true } },
            ratings: { select: { value: true } }
          }
        }
      }
    });

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const articleRatingStats = await prisma.rating.aggregate({
      where: {
        article: {
          authorId: user.id,
          published: true
        }
      },
      _avg: { value: true },
      _count: { value: true }
    });

    const articles = user.articles.map((article: any) => {
      const avg = article.ratings.length
        ? article.ratings.reduce((sum: number, rating: { value: number }) => sum + rating.value, 0) /
          article.ratings.length
        : 0;

      return {
        id: article.id,
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        publishedAt: article.publishedAt,
        updatedAt: article.updatedAt,
        ratingCount: article._count.ratings,
        ratingAverage: Number(avg.toFixed(2))
      };
    });

    return res.json({
      profile: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        articleCount: articles.length,
        ratingCount: articleRatingStats._count.value,
        ratingAverage: Number((articleRatingStats._avg.value ?? 0).toFixed(2))
      },
      articles
    });
  })
);

export default userRouter;
