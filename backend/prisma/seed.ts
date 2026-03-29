import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import process from "node:process";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@bulbipedia.local" },
    update: {},
    create: {
      email: "admin@bulbipedia.local",
      username: "admin",
      passwordHash: adminPassword,
      role: "ADMIN"
    }
  });

  const title = "Bulbizarre";
  const slug = slugify(title, { lower: true, strict: true, locale: "fr" });

  await prisma.article.upsert({
    where: { slug },
    update: {},
    create: {
      slug,
      title,
      summary: "Le premier Pokemon du Pokedex National.",
      content:
        "Bulbizarre est un Pokemon de type Plante/Poison. Cet article seed sert de base a l'API.",
      published: true,
      publishedAt: new Date(),
      authorId: admin.id
    }
  });

  console.log("Seed complete. Admin: admin@bulbipedia.local / admin1234");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
