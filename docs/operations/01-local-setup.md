# 01 - Setup local (sans Docker)

## Prerequis

- Node.js 22+
- npm (backend)
- pnpm via corepack (frontend)
- PostgreSQL accessible (local ou distant)

## Setup backend

Depuis la racine du repo:

```powershell
Copy-Item .\backend\.env.example .\backend\.env
npm --prefix backend install
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate -- --name init
npm --prefix backend run prisma:seed
npm --prefix backend run dev
```

Backend par defaut: `http://localhost:4000`.

Si tu reviens d'une base plus ancienne ou d'une sauvegarde, rejoue toutes les migrations Prisma avant de valider le profil et les articles, sinon tu peux voir un login fonctionnel mais des pages article/profil en echec.

Les fichiers images televerses en local sont stockes dans `backend/uploads` et accessibles via `http://localhost:4000/uploads/*`.

## Setup frontend

```powershell
corepack pnpm --dir .\frontend i
corepack pnpm --dir .\frontend run dev
```

Frontend par defaut: `http://localhost:3000`.

## Variables utiles

- Backend: `backend/.env`
- Frontend: optionnel `frontend/.env` avec `VITE_API_BASE_URL`

Exemple:

```env
VITE_API_BASE_URL="http://127.0.0.1:4000"
```
