import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth } from "../middleware/auth";
import { buildUniqueSlug } from "../utils/slug";
import { sendError } from "../utils/http";
import { createArticleSchema, updateArticleSchema } from "../validators/article";
import { deleteStoredImage, imageUpload, saveUploadedImage } from "../utils/uploads";

const articleRouter = Router();

const articleListSelect = {
  id: true,
  slug: true,
  title: true,
  summary: true,
  content: true,
  heroImageUrl: true,
  published: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, username: true } },
  _count: { select: { ratings: true } },
  ratings: { select: { value: true } }
} as const;

const articleEditSelect = {
  id: true,
  slug: true,
  title: true,
  summary: true,
  content: true,
  heroImageUrl: true,
  published: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, username: true } },
  _count: { select: { ratings: true } },
  ratings: { select: { value: true } }
} as const;

function serializeArticle(article: any) {
  const avg = article.ratings.length
    ? article.ratings.reduce((sum: number, rating: { value: number }) => sum + rating.value, 0) /
      article.ratings.length
    : 0;

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    content: article.content,
    heroImageUrl: article.heroImageUrl,
    published: article.published,
    publishedAt: article.publishedAt,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    author: article.author,
    ratingCount: article._count.ratings,
    ratingAverage: Number(avg.toFixed(2))
  };
}

articleRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const q = String(req.query.q ?? "").trim();
    const author = String(req.query.author ?? "").trim();

    const articles = await prisma.article.findMany({
      where: {
        published: true,
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { summary: { contains: q, mode: "insensitive" } },
                { content: { contains: q, mode: "insensitive" } }
              ]
            }
          : {}),
        ...(author ? { author: { username: { equals: author, mode: "insensitive" } } } : {})
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: articleListSelect
    });

    return res.json({
      articles: articles.map(serializeArticle)
    });
  })
);

articleRouter.get(
  "/mine",
  requireAuth,
  asyncHandler(async (req, res) => {
    const articles = await prisma.article.findMany({
      where: { authorId: req.user!.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        content: true,
        heroImageUrl: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { ratings: true } },
        ratings: { select: { value: true } }
      }
    });

    return res.json({
      articles: articles.map((article: any) => {
        const avg = article.ratings.length
          ? article.ratings.reduce((sum: number, rating: { value: number }) => sum + rating.value, 0) /
            article.ratings.length
          : 0;

        return {
          id: article.id,
          slug: article.slug,
          title: article.title,
          summary: article.summary,
          content: article.content,
          heroImageUrl: article.heroImageUrl,
          published: article.published,
          publishedAt: article.publishedAt,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          ratingCount: article._count.ratings,
          ratingAverage: Number(avg.toFixed(2))
        };
      })
    });
  })
);

articleRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const article = await prisma.article.findUnique({
      where: { slug: req.params.slug },
      select: articleListSelect
    });

    if (!article) {
      return sendError(res, 404, "Article not found");
    }

    if (!article.published) {
      return sendError(res, 404, "Article not found");
    }

    const avg = article.ratings.length
      ? article.ratings.reduce((sum: number, rating: { value: number }) => sum + rating.value, 0) /
        article.ratings.length
      : 0;

    return res.json({
      article: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        content: article.content,
        published: article.published,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        author: article.author,
        ratingCount: article._count.ratings,
        ratingAverage: Number(avg.toFixed(2))
      }
    });
  })
);

articleRouter.post(
  "/",
  requireAuth,
  imageUpload.single("heroImage"),
  asyncHandler(async (req, res) => {
    const input = createArticleSchema.parse(req.body);
    const slug = await buildUniqueSlug(input.title);
    let uploadedHeroImagePath: string | null = null;

    const heroImageUrl = req.file
      ? ((uploadedHeroImagePath = await saveUploadedImage(req.file, "article")), uploadedHeroImagePath)
      : input.heroImageUrl;

    try {
      const article = await prisma.article.create({
        data: {
          slug,
          title: input.title,
          summary: input.summary,
          content: input.content,
          ...(heroImageUrl !== undefined ? { heroImageUrl } : {}),
          published: input.published ?? false,
          publishedAt: input.published ? new Date() : null,
          authorId: req.user!.id
        },
        select: articleEditSelect
      });

      return res.status(201).json({ article: serializeArticle(article) });
    } catch (error) {
      if (uploadedHeroImagePath) {
        await deleteStoredImage(uploadedHeroImagePath);
      }

      throw error;
    }
  })
);

articleRouter.patch(
  "/:slug",
  requireAuth,
  imageUpload.single("heroImage"),
  asyncHandler(async (req, res) => {
    const input = updateArticleSchema.parse(req.body);
    let uploadedHeroImagePath: string | null = null;

    const existing = await prisma.article.findUnique({
      where: { slug: req.params.slug },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        content: true,
        heroImageUrl: true,
        published: true,
        publishedAt: true,
        authorId: true
      }
    });
    if (!existing) {
      return sendError(res, 404, "Article not found");
    }

    if (existing.authorId !== req.user!.id && req.user!.role !== "ADMIN") {
      return sendError(res, 403, "Forbidden");
    }

    const nextTitle = input.title ?? existing.title;
    const nextSlug = input.title ? await buildUniqueSlug(nextTitle, existing.id) : existing.slug;
    const nextPublished = input.published ?? existing.published;
    const nextHeroImageUrl = req.file
      ? ((uploadedHeroImagePath = await saveUploadedImage(req.file, "article")), uploadedHeroImagePath)
      : input.heroImageUrl !== undefined
        ? input.heroImageUrl
        : existing.heroImageUrl;

    const article = await prisma.article.update({
      where: { id: existing.id },
      data: {
        slug: nextSlug,
        title: nextTitle,
        summary: input.summary === undefined ? existing.summary : input.summary,
        content: input.content ?? existing.content,
        ...(req.file || input.heroImageUrl !== undefined ? { heroImageUrl: nextHeroImageUrl } : {}),
        published: nextPublished,
        publishedAt: nextPublished ? existing.publishedAt ?? new Date() : null
      },
      select: articleEditSelect
    });

    if ((req.file || input.heroImageUrl !== undefined) && existing.heroImageUrl && existing.heroImageUrl !== nextHeroImageUrl) {
      await deleteStoredImage(existing.heroImageUrl);
    }

    return res.json({ article: serializeArticle(article) });
  })
);

articleRouter.delete(
  "/:slug",
  requireAuth,
  asyncHandler(async (req, res) => {
    const existing = await prisma.article.findUnique({
      where: { slug: req.params.slug },
      select: { id: true, slug: true, authorId: true, heroImageUrl: true }
    });
    if (!existing) {
      return sendError(res, 404, "Article not found");
    }

    if (existing.authorId !== req.user!.id && req.user!.role !== "ADMIN") {
      return sendError(res, 403, "Forbidden");
    }

    await prisma.article.delete({ where: { id: existing.id } });

    await deleteStoredImage(existing.heroImageUrl);

    return res.status(204).send();
  })
);

export default articleRouter;
