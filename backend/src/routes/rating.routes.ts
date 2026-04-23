import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth } from "../middleware/auth";
import { sendError } from "../utils/http";
import { rateArticleSchema } from "../validators/article";

const ratingRouter = Router();

ratingRouter.get(
  "/:slug/ratings",
  asyncHandler(async (req, res) => {
    const article = await prisma.article.findUnique({
      where: { slug: req.params.slug },
      select: {
        id: true,
        slug: true,
        published: true,
        ratings: {
          select: {
            userId: true,
            value: true
          }
        }
      }
    });

    if (!article || !article.published) {
      return sendError(res, 404, "Article not found");
    }

    const count = article.ratings.length;
    const average =
      count === 0
        ? 0
        : Number(
            (
              article.ratings.reduce(
                (sum: number, rating: { value: number }) => sum + rating.value,
                0
              ) / count
            ).toFixed(2)
          );

    return res.json({
      articleSlug: article.slug,
      count,
      average
    });
  })
);

ratingRouter.post(
  "/:slug/rating",
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = rateArticleSchema.parse(req.body);

    const article = await prisma.article.findUnique({
      where: { slug: req.params.slug },
      select: {
        id: true,
        slug: true,
        published: true
      }
    });
    if (!article || !article.published) {
      return sendError(res, 404, "Article not found");
    }

    await prisma.rating.upsert({
      where: {
        articleId_userId: {
          articleId: article.id,
          userId: req.user!.id
        }
      },
      update: {
        value: input.value
      },
      create: {
        articleId: article.id,
        userId: req.user!.id,
        value: input.value
      }
    });

    const ratings = await prisma.rating.findMany({
      where: { articleId: article.id },
      select: { value: true }
    });

    const count = ratings.length;
    const average =
      count === 0
        ? 0
        : Number(
            (
              ratings.reduce((sum: number, rating: { value: number }) => sum + rating.value, 0) /
              count
            ).toFixed(2)
          );

    return res.json({
      articleSlug: article.slug,
      count,
      average,
      yourRating: input.value
    });
  })
);

export default ratingRouter;
