# Bulbipedia Backend

API REST Bulbipedia (auth, articles, notes) avec Express + TypeScript + Prisma + PostgreSQL.

## Fonctionnalites

- Inscription/connexion via JWT
- CRUD d'articles avec ownership auteur
- Notation des articles (1 a 5)
- Endpoints de sante et stats de notation

## Stack

- Node.js 22+
- Express
- Prisma
- PostgreSQL
- Zod

## Demarrage local (sans Docker)

1. Copier les variables d'environnement:

```powershell
Copy-Item .env.example .env
```

2. Verifier la connexion PostgreSQL dans `.env` (locale ou distante).

3. Installer les dependances:

```powershell
npm --prefix backend install
```

4. Generer Prisma puis migrer:

```powershell
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate -- --name init
```

5. Seed de demo:

```powershell
npm --prefix backend run prisma:seed
```

6. Lancer l'API:

```powershell
npm --prefix backend run dev
```

API disponible sur `http://localhost:4000`.

## Endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/articles`
- `GET /api/articles/mine`
- `GET /api/articles/:slug`
- `POST /api/articles`
- `PATCH /api/articles/:slug`
- `DELETE /api/articles/:slug`
- `GET /api/articles/:slug/ratings`
- `POST /api/articles/:slug/rating`

## Mise en ligne (sans Docker)

1. Creer une base PostgreSQL managée.
2. Deployer `backend` comme service Node.
3. Configurer:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `CORS_ORIGIN`
  - `PORT`
4. Build/start:
  - Build: `npm install ; npm run prisma:generate ; npm run build ; npm run prisma:deploy`
  - Start: `npm run start`

## Documentation liee

- `../docs/architecture/02-backend.md`
- `../docs/architecture/04-data-model.md`
- `../docs/operations/01-local-setup.md`

## Securite

- Utiliser HTTPS en production.
- Definir un `JWT_SECRET` robuste.
- Restreindre `CORS_ORIGIN` au domaine frontend.
