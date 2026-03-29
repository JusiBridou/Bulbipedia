# Bulbipedia Backend

API REST pour Bulbipedia (auth, articles, notes) avec Express + TypeScript + Prisma + PostgreSQL.

## Fonctionnalites

- Creation de compte et connexion (JWT)
- Publication d'articles (brouillon/publication)
- Edition/suppression de ses propres articles
- Notation d'articles (1 a 5)
- Statistiques de notes (moyenne + nombre de votes)

## Stack

- Node.js 22+
- Express
- Prisma
- PostgreSQL
- Zod

## Demarrage local

1. Copier les variables d'environnement:

```powershell
Copy-Item .env.example .env
```

2. Lancer PostgreSQL via Docker (option recommandee):

```powershell
docker compose -f .\backend\docker-compose.yml up -d db
```

Note: le conteneur PostgreSQL expose le port `55432` sur la machine hote pour eviter les conflits avec un PostgreSQL local sur `5432`.

3. Installer les dependances:

```powershell
npm --prefix backend install
```

4. Generer Prisma puis migrer:

```powershell
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate -- --name init
```

5. Seed de demo (admin + article exemple):

```powershell
npm --prefix backend run prisma:seed
```

6. Lancer l'API:

```powershell
npm --prefix backend run dev
```

API disponible sur `http://localhost:4000`.

## Endpoints principaux

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `GET /api/articles`
- `GET /api/articles/mine` (Bearer token)
- `GET /api/articles/:slug`
- `POST /api/articles` (Bearer token)
- `PATCH /api/articles/:slug` (Bearer token)
- `DELETE /api/articles/:slug` (Bearer token)
- `GET /api/articles/:slug/ratings`
- `POST /api/articles/:slug/rating` (Bearer token)

## Exemples rapides

Inscription:

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@demo.com","username":"userdemo","password":"motdepasse123"}'
```

Creation d'article (avec token JWT):

```bash
curl -X POST http://localhost:4000/api/articles \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Mon article","summary":"Resume court","content":"Contenu long d au moins 50 caracteres...","published":true}'
```

Notation:

```bash
curl -X POST http://localhost:4000/api/articles/mon-article/rating \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"value":5}'
```

## Mise en ligne

### Option 1: Render / Railway (simple)

1. Creer une base PostgreSQL managée.
2. Deployer le dossier `backend` comme service Node.
3. Variables d'environnement a definir:
   - `DATABASE_URL`
   - `JWT_SECRET` (long et aleatoire)
   - `JWT_EXPIRES_IN` (ex: `7d`)
   - `CORS_ORIGIN` (URL du frontend en prod)
   - `PORT` (souvent injecte automatiquement)
4. Commandes build/start:
   - Build: `npm install ; npm run prisma:generate ; npm run build ; npm run prisma:deploy`
   - Start: `npm run start`

### Option 2: Docker

```powershell
docker compose -f .\backend\docker-compose.yml up -d --build
```

Puis appliquer les migrations dans le conteneur API:

```powershell
docker compose -f .\backend\docker-compose.yml exec api npm run prisma:deploy
```

## Depannage

Si `npm --prefix backend run prisma:migrate -- --name init` echoue avec `P1000`:

1. Verifier que Docker DB est lance:

```powershell
docker compose -f .\backend\docker-compose.yml ps
```

2. Verifier `DATABASE_URL` dans `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:55432/bulbipedia?schema=public"
```

3. Supprimer une variable de session qui pourrait ecraser `.env`:

```powershell
if (Test-Path Env:DATABASE_URL) { Remove-Item Env:DATABASE_URL }
```

## Notes securite

- Utiliser HTTPS en production.
- Changer `JWT_SECRET` avec une valeur robuste.
- Limiter `CORS_ORIGIN` a ton domaine frontend.
- Ajouter rate limiting et verification email en prochaine iteration.
