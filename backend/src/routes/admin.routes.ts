import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { sendError } from "../utils/http";
import { deleteStoredImage } from "../utils/uploads";

const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get(
  "/users",
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
            ratings: true
          }
        }
      }
    });

    return res.json({ users });
  })
);

adminRouter.delete(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const userId = req.params.id;

    if (userId === req.user!.id) {
      return sendError(res, 400, "Admin cannot delete their own account");
    }

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return sendError(res, 404, "User not found");
    }

    const userAssets = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        avatarUrl: true,
        articles: {
          select: {
            heroImageUrl: true
          }
        }
      }
    });

    await prisma.user.delete({ where: { id: userId } });

    await deleteStoredImage(userAssets?.avatarUrl);
    await Promise.all((userAssets?.articles ?? []).map((article) => deleteStoredImage(article.heroImageUrl)));

    console.info("[ADMIN_ACTION] user_deleted", {
      actorId: req.user!.id,
      actorUsername: req.user!.username,
      targetUserId: userId,
      targetUsername: existing.username,
      timestamp: new Date().toISOString()
    });

    return res.status(204).send();
  })
);

adminRouter.get(
  "/articles",
  asyncHandler(async (_req, res) => {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    return res.json({ articles });
  })
);

adminRouter.delete(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const articleId = req.params.id;

    const existing = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        slug: true,
        title: true,
        heroImageUrl: true,
        author: {
          select: { username: true }
        }
      }
    });

    if (!existing) {
      return sendError(res, 404, "Article not found");
    }

    await prisma.article.delete({ where: { id: articleId } });

    await deleteStoredImage(existing.heroImageUrl);

    console.info("[ADMIN_ACTION] article_deleted", {
      actorId: req.user!.id,
      actorUsername: req.user!.username,
      targetArticleId: articleId,
      targetArticleSlug: existing.slug,
      targetAuthorUsername: existing.author.username,
      timestamp: new Date().toISOString()
    });

    return res.status(204).send();
  })
);

export default adminRouter;
