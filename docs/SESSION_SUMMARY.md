# Resume des sessions - Bulbipedia

Ce document sert de memoire operationnelle entre les sessions.

## Session 2026-04-19

### Objectif
- Reprendre le projet proprement avec une base de travail claire.

### Travail realise
- Nettoyage des elements de deploiement Docker pour repartir d'une base simple.
- Suppression des fichiers suivants:
  - `backend/docker-compose.yml`
  - `backend/Dockerfile`
  - `frontend/todo.md`
- Refonte des README pour une reprise sans Docker:
  - `README.md`
  - `backend/README.md`
  - `frontend/README.md`
- Mise a jour de `backend/.env.example` avec PostgreSQL local standard (`5432`).
- Creation d'une documentation en cascade:
  - `docs/README.md`
  - `docs/architecture/01-overview.md`
  - `docs/architecture/02-backend.md`
  - `docs/architecture/03-frontend.md`
  - `docs/architecture/04-data-model.md`
  - `docs/operations/01-local-setup.md`
  - `docs/operations/02-quality-checks.md`
- Creation et consolidation du plan de reprise dans `TODO.md`.
- Remediation controlee des vulnerabilites backend:
  - upgrade `prisma` et `@prisma/client` vers `^6.19.3`,
  - ajout d'un `overrides.path-to-regexp=0.1.13`,
  - revalidation `npm audit` backend a 0 vulnerabilite.

### Verifications executees
- Backend:
  - `npm --prefix backend install`
  - `npm --prefix backend run build`
  - `npm --prefix backend audit --json`
- Frontend:
  - `corepack pnpm --dir .\frontend i`
  - `corepack pnpm --dir .\frontend run lint`
  - `corepack pnpm --dir .\frontend run build`
- Resultat: build/lint OK, audit backend OK (0 vuln), aucune erreur IDE detectee.

### Points ouverts prioritaires
1. Documenter une strategie de deploiement v1 sans Docker.
2. Ajouter une base de tests API.
3. Ajouter des checks CI automatiques (lint/build).

## Session 2026-04-19 (suite - roadmap produit)

### Objectif
- Aligner le projet avec le besoin cible: comptes, publication/notation, admin, mise en ligne.

### Travail realise
- Ajout d'une roadmap projet detaillee:
  - `docs/operations/03-project-roadmap.md`
- Mise a jour de la navigation docs:
  - `docs/README.md`
- Mise a jour du `TODO.md` avec plan de phases (1 a 4).
- Demarrage de la phase 1 (comptes complets) avec implementation:
  - ajout `avatarUrl` optionnel dans le modele `User` Prisma,
  - ajout migration `20260419143000_add_user_avatar_url`,
  - MAJ auth backend (`register`, `login`, `me`) pour exposer `avatarUrl`,
  - MAJ frontend inscription + affichage avatar dans le header.

### Verifications executees
- `npm --prefix backend run prisma:generate`
- `npm --prefix backend run build`
- `corepack pnpm --dir .\frontend run build`
- Resultat: builds backend/frontend OK.

### Points ouverts prioritaires
1. Appliquer la migration avatar sur la base cible.
2. Ajouter les endpoints/admin UI pour suppression des comptes.
3. Documenter la strategie de deploiement public v1.
4. Ajouter tests API + checks CI.

## Session 2026-04-19 (suite - etape 2 administration)

### Objectif
- Implementer l'etape 2 du plan: droits et administration.

### Travail realise
- Backend:
  - ajout du middleware `requireAdmin`,
  - creation des routes `/api/admin`:
    - `GET /api/admin/users`,
    - `DELETE /api/admin/users/:id`,
    - `GET /api/admin/articles`,
    - `DELETE /api/admin/articles/:id`.
  - journalisation serveur sur suppression user/article.
- Frontend:
  - ajout d'un client API admin,
  - creation de la page admin minimale `src/pages/AdminPage.tsx`,
  - ajout de la route `/admin`,
  - ajout du lien Admin dans le header pour les comptes ADMIN.
- Documentation:
  - roadmap, architecture backend/frontend, README backend, TODO mis a jour.

### Verifications executees
- `npm --prefix backend run build`
- `corepack pnpm --dir .\frontend run lint`
- `corepack pnpm --dir .\frontend run build`
- Resultat: OK.

### Points ouverts prioritaires
1. Appliquer la migration avatar sur la base cible.
2. Ajouter tests ACL admin automatises (API).
3. Documenter la strategie de deploiement public v1.
4. Ajouter checks CI (lint/build/audit).

## Session 2026-04-19 (suite - base de tests API)

### Objectif
- Demarrer la base de tests API avec priorite ACL admin.

### Travail realise
- Ajout des dependances de test backend:
  - `supertest`,
  - `@types/supertest`.
- Ajout du script backend:
  - `npm --prefix backend run test:api`.
- Ajout du fichier de tests:
  - `backend/tests/api/admin-acl.test.ts`.
- Cas verifies:
  - `GET /api/admin/users` -> 401 sans token,
  - `GET /api/admin/users` -> 403 avec token USER,
  - `DELETE /api/admin/users/:id` -> 403 avec token USER,
  - `GET /api/admin/articles` -> 403 avec token USER.
- Documentation mise a jour (`backend/README.md`, `docs/operations/02-quality-checks.md`, roadmap, TODO).

### Verifications executees
- `npm --prefix backend run test:api` -> 4/4 tests OK.

### Points ouverts prioritaires
1. Appliquer la migration avatar sur la base cible.
2. Etendre la suite de tests API (auth + articles + ratings).
3. Documenter la strategie de deploiement public v1.
4. Ajouter checks CI (lint/build/audit + test:api).

## Session 2026-04-19 (suite - extension tests API)

### Objectif
- Continuer le plan TODO en etendant la suite API a auth/articles/ratings.

### Travail realise
- Ajout du fichier `backend/tests/api/core-acl-validation.test.ts`.
- Tests ajoutes:
  - `POST /api/auth/register` payload invalide -> 400,
  - `POST /api/auth/login` payload invalide -> 400,
  - `GET /api/auth/me` sans token -> 401,
  - `POST /api/articles` sans token -> 401,
  - `GET /api/articles/mine` sans token -> 401,
  - `POST /api/articles/:slug/rating` sans token -> 401.
- En combinaison avec `admin-acl.test.ts`, la suite couvre maintenant admin + auth + articles + ratings (cas critiques ACL/validation).
- Documentation et TODO synchronises.

### Verifications executees
- `npm --prefix backend run test:api` -> 10/10 OK.
- `npm --prefix backend run build` -> OK.

### Points ouverts prioritaires
1. Appliquer la migration avatar sur la base cible.
2. Documenter la strategie de deploiement public v1.
3. Ajouter checks CI (lint/build/test:api/audit).
4. Ajouter des tests d'integration API avec base de donnees de test.

## Session 2026-04-19 (suite - guidance deploiement debutant)

### Objectif
- Repondre aux questions debutant de deploiement (hebergeur, BDD, quoi faire concretement).

### Travail realise
- Redaction d'un runbook deploiement complet:
  - `docs/operations/04-deployment-runbook.md`.
- Contenu ajoute:
  - faut-il contacter un hebergeur ? (reponse: non, plateformes self-service),
  - comparatif simple d'options hebergement,
  - recommendation v1 (Vercel + Railway + PostgreSQL managée),
  - configuration `DATABASE_URL` + variables d'environnement,
  - commandes build/start backend,
  - configuration frontend (`VITE_API_BASE_URL`),
  - checks CORS/HTTPS,
  - smoke tests prod,
  - utilisation de pgAdmin avec base managée + requetes SQL de controle.
- Mise a jour de la navigation docs, roadmap et TODO.

### Points ouverts prioritaires
1. Appliquer la migration avatar sur la base cible.
2. Executer le deploiement v1 reel en suivant le runbook.
3. Ajouter checks CI (lint/build/test:api/audit).
4. Ajouter des tests d'integration API avec base de donnees de test.

## Session 2026-04-19 (suite - runbook V1 detaille)

### Objectif
- Produire un runbook deploiement V1 tres detaille pour profil debutant.

### Travail realise
- Le fichier `docs/operations/04-deployment-runbook.md` a ete fortement detaille avec:
  - choix hebergeurs recommandes,
  - procedure complete Railway (backend + Postgres),
  - procedure complete Vercel (frontend),
  - variables d'environnement exactes,
  - commande de generation de JWT secret,
  - checks CORS/HTTPS,
  - smoke tests prod,
  - verification SQL via pgAdmin,
  - section de depannage,
  - checklist finale et rollback.
- TODO aligne: strategie de deploiement documentee marquee complete.

### Points ouverts prioritaires
1. Appliquer la migration avatar sur la base cible.
2. Executer le deploiement v1 reel en suivant le runbook.
3. Ajouter checks CI (lint/build/test:api/audit).
4. Ajouter des tests d'integration API avec base de donnees de test.

## Mode d'utilisation pour les prochaines sessions

1. Lire ce fichier en premier pour recuperer le contexte.
2. Relire `TODO.md` pour connaitre les priorites courantes.
3. Mettre a jour ce resume en fin de session avec:
   - ce qui a ete fait,
   - les validations executees,
   - les nouveaux points ouverts.
