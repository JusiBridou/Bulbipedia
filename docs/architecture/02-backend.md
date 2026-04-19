# 02 - Architecture backend

## Entree backend

- Point de demarrage: `src/server.ts`
- Construction app Express: `src/app.ts`

## Organisation des couches

- `src/config`: chargement env et configuration runtime.
- `src/lib`: clients partages (Prisma).
- `src/middleware`: auth, gestion d'erreurs, wrappers async.
- `src/routes`: endpoints par domaine (`auth`, `article`, `rating`, `health`).
- `src/validators`: schemas Zod d'entree.
- `src/utils`: utilitaires (HTTP, JWT, slug).

## Contrats API

Domaines principaux:
- Auth: register, login, me.
- Article: recherche, lecture slug, CRUD auteur.
- Rating: lecture aggregate et vote utilisateur.
- Admin: gestion comptes et articles (liste/suppression) reservee ADMIN.

## Controle d'acces

- `requireAuth`: token JWT obligatoire.
- `requireAdmin`: role ADMIN obligatoire pour les routes `/api/admin/*`.
- Les actions de suppression admin sont journalisees cote serveur.

## Donnees et migration

- Modele Prisma: `prisma/schema.prisma`
- Migrations: `prisma/migrations/*`
- Seed: `prisma/seed.ts`

## Variables d'environnement

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN`
- `PORT`

## Risques techniques identifies

- Forte dependance a la qualite de `DATABASE_URL` pour toutes les operations.
- Necessite de conserver coherence entre validators Zod et modeles Prisma.
