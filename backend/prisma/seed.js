"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const slugify_1 = __importDefault(require("slugify"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminPassword = await bcryptjs_1.default.hash("admin1234", 10);
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
    const slug = (0, slugify_1.default)(title, { lower: true, strict: true, locale: "fr" });
    await prisma.article.upsert({
        where: { slug },
        update: {},
        create: {
            slug,
            title,
            summary: "Le premier Pokemon du Pokedex National.",
            content: "Bulbizarre est un Pokemon de type Plante/Poison. Cet article seed sert de base a l'API.",
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
