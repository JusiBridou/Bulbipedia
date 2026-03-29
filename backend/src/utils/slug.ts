import slugify from "slugify";
import { prisma } from "../lib/prisma";

export async function buildUniqueSlug(title: string, currentArticleId?: string): Promise<string> {
  const base = slugify(title, { lower: true, strict: true, locale: "fr" }) || "article";
  let slug = base;
  let index = 1;

  while (true) {
    const existing = await prisma.article.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!existing || existing.id === currentArticleId) {
      return slug;
    }

    slug = `${base}-${index}`;
    index += 1;
  }
}
