# Le Bulbipédia

Ce projet correspond a la creation d'une encyclopedie en ligne centree autour de la liste BDA Bulbiz'art de Centrale Nantes.

## Structure du projet

- `frontend/`: application React + Vite
- `backend/`: API REST Node.js + Express + Prisma + PostgreSQL

## Fonctionnalites cibles

- Comptes utilisateurs (inscription / connexion)
- Publication et edition d'articles
- Notation des articles
- Mise en ligne avec base de donnees PostgreSQL

## Lancer le frontend

```powershell
corepack pnpm --dir .\frontend i
corepack pnpm --dir .\frontend run dev
```

## Lancer le backend

```powershell
Copy-Item .env.example .env
docker compose -f .\backend\docker-compose.yml up -d db
npm --prefix backend install
npm --prefix backend run prisma:generate
if (Test-Path Env:DATABASE_URL) { Remove-Item Env:DATABASE_URL }
npm --prefix backend run prisma:migrate -- --name init
npm --prefix backend run prisma:seed
npm --prefix backend run dev
```

Backend sur `http://localhost:4000`.

Note: PostgreSQL Docker est expose sur `localhost:55432` pour eviter les conflits avec un PostgreSQL local sur `5432`.

## Prochaines etapes

1. Connecter le frontend a l'API backend.
2. Ajouter l'upload d'images pour les articles.
3. Deployer frontend + backend (Render/Railway/Vercel + DB managée).
