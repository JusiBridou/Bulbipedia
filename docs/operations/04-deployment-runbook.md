# 04 - Runbook de deploiement V1 (pas a pas, debutant)

Ce document explique en detail comment mettre Bulbipedia en ligne pour la premiere fois.

## 1) Choix simple recommande

Pour une V1 rapide et stable:

1. Frontend: Vercel
2. Backend: Railway
3. Base de donnees: Railway Postgres

Tu n'as pas besoin de "contacter" un hebergeur au debut. Tout est self-service:

1. Tu crees un compte
2. Tu connectes GitHub
3. Tu renseignes les variables d'environnement
4. Tu deploies

## 2) Prerequis avant deploiement

Avant tout deploiement, depuis la racine du repo, verifier:

```powershell
npm --prefix backend run build
npm --prefix backend run test:api
corepack pnpm --dir .\frontend run build
```

Si une commande echoue, corriger avant de continuer.

## 3) Etape A - Publier le code sur GitHub

1. Creer un repo GitHub (public ou prive)
2. Pousser le projet
3. Verifier que les dossiers `backend` et `frontend` sont bien presents

## 4) Etape B - Creer PostgreSQL sur Railway

1. Aller sur Railway
2. New Project
3. Add Service
4. Database
5. PostgreSQL

Apres creation, recuperer:

1. host
2. port
3. database
4. user
5. password
6. connection URL complete

Format attendu:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"
```

## 5) Etape C - Deployer le backend sur Railway

1. Dans Railway, ajouter un service depuis GitHub repo
2. Choisir le dossier `backend` comme source
3. Configurer les variables d'environnement backend

Variables obligatoires:

```env
NODE_ENV=production
PORT=4000
DATABASE_URL="postgresql://..."
JWT_SECRET="met_une_cle_longue_et_aleatoire"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="https://ton-frontend.vercel.app"
```

Generation d'un secret robuste (PowerShell):

```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

Configurer les commandes Railway:

1. Build Command:

```bash
npm install && npm run prisma:generate && npm run build
```

2. Start Command:

```bash
npm run start
```

Pourquoi: pendant la phase build, Railway peut ne pas donner acces au host prive
`postgres.railway.internal`. Si tu lances `prisma migrate deploy` au build, tu peux avoir
une erreur P1001 meme si la base est saine.

Apres deploy, verifier le health check:

1. recuperer l'URL publique backend
2. ouvrir `https://TON_BACKEND_URL/api/health`
3. reponse attendue: statut OK (JSON)

## 6) Etape D - Deployer le frontend sur Vercel

1. Aller sur Vercel
2. Add New Project
3. Import Git Repository
4. Choisir le repo Bulbipedia
5. Root Directory: `frontend`

Configurer la variable frontend:

```env
VITE_API_BASE_URL="https://TON_BACKEND_URL"
```

Build settings Vite standard:

1. Install command: `pnpm install` (ou auto)
2. Build command: `pnpm run build`
3. Output directory: `dist`

Lancer le deploy et recuperer l'URL Vercel.

## 7) Etape E - Relier frontend et backend proprement

1. Copier URL frontend prod (Vercel)
2. Mettre a jour `CORS_ORIGIN` dans Railway backend avec cette URL exacte
3. Redeployer backend si necessaire
4. Verifier qu'aucune erreur CORS n'apparait dans le navigateur

Si tu utilises un domaine custom plus tard:

1. mettre DNS
2. mettre a jour `CORS_ORIGIN`
3. mettre a jour `VITE_API_BASE_URL` si URL backend change

## 8) Etape F - Appliquer les migrations Prisma en prod

Apres un deploy backend reussi, lancer la migration depuis Railway (service backend),
quand le reseau de runtime est actif:

```bash
npm run prisma:deploy
```

Procedure conseillée:

1. Ouvrir le service backend Railway
2. Ouvrir un Shell/Command dans ce service
3. Executer `npm run prisma:deploy`
4. Verifier le log: "No pending migrations" ou "migrations applied"
5. Redemarrer le service backend si Railway ne le fait pas automatiquement

Controle a faire dans les logs backend:

1. migrations appliquees sans erreur
2. client Prisma genere
3. serveur demarre normalement

## 9) Etape G - Smoke tests manuels V1

Apres mise en ligne:

1. Ouvrir le frontend public
2. Creer un compte
3. Se connecter
4. Publier un article
5. Lire l'article publie
6. Noter l'article
7. Se connecter avec compte admin
8. Ouvrir `/admin` et verifier liste users/articles
9. Tester une suppression admin sur donnee de test

## 10) Etape H - Verification SQL avec pgAdmin

Tu peux utiliser pgAdmin avec la base managée:

1. Creer un serveur dans pgAdmin
2. Renseigner host/port/user/password depuis Railway
3. Ouvrir la base
4. Verifier tables Prisma

Requetes utiles:

```sql
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Article";
SELECT COUNT(*) FROM "Rating";
SELECT id, email, username, role, "createdAt"
FROM "User"
ORDER BY "createdAt" DESC
LIMIT 20;
```

## 11) Erreurs frequentes et correction rapide

1. Erreur CORS frontend
  1. verifier `CORS_ORIGIN`
  2. il doit etre exactement l'URL frontend (sans slash final inutile)

2. Erreur DB connection
  1. verifier `DATABASE_URL`
  2. verifier mot de passe encode correctement
  3. verifier que la DB est bien Running

3. Erreur migration Prisma
  1. verifier droits DB
  2. sur Railway, ne pas lancer `prisma:deploy` au build
  3. lancer `npm run prisma:deploy` apres deploy via shell du service backend
  4. si erreur P1001 sur `postgres.railway.internal`, verifier que la commande est bien lancee en runtime (pas en build)

4. Frontend appelle localhost en prod
  1. verifier `VITE_API_BASE_URL` sur Vercel
  2. redeployer frontend

## 12) Checklist finale avant annonce publique

1. Health endpoint backend OK
2. Inscription / login OK
3. Publication / lecture / rating OK
4. Admin panel OK
5. CORS OK
6. HTTPS OK
7. Logs backend sans erreurs critiques

## 13) Plan de rollback minimal

Si deploy casse la prod:

1. Revenir a la version precedente (rollback git/tag sur plateforme)
2. Reappliquer anciennes variables d'environnement si necessaire
3. Verifier `api/health`
4. Bloquer nouvelles migrations tant que bug non corrige

## 14) Estimation budget V1

Ordre de grandeur (variable selon usage):

1. Vercel: souvent gratuit pour debut
2. Railway: petit palier payant possible selon ressources
3. Railway Postgres: peut passer en plan payant rapidement si usage augmente

Decision pratique:

1. Commencer simple
2. Monitorer l'usage reel
3. Optimiser ensuite
