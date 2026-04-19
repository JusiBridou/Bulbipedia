# 03 - Roadmap projet (fonctionnel + mise en ligne)

## Objectif cible

Construire une plateforme publique Bulbipedia avec:
- comptes utilisateurs,
- publication/lecture/notation d'articles,
- moderation admin (comptes + articles),
- deploiement fiable (frontend + backend + base de donnees).

## Etat actuel (resume)

- Backend deja present pour auth/articles/ratings avec roles `USER`/`ADMIN`.
- Frontend deja connecte a l'API pour inscription/connexion/publication/notation.
- Manques principaux pour ton besoin:
  - photo de profil utilisateur,
  - administration des comptes (suppression),
  - documentation de deploiement public end-to-end.

## Plan d'action par phases

## Phase 1 - Comptes utilisateurs complets

1. Ajouter une photo de profil optionnelle au compte (`avatarUrl`).
2. Etendre API auth (`register`, `me`) pour retourner ce champ.
3. Mettre a jour le formulaire d'inscription frontend.
4. Ajouter migration Prisma + verifier build.

Definition of done:
- inscription avec `username/email/password` + `avatarUrl` optionnel,
- champ persiste en base,
- visible dans l'UI (header).

## Phase 2 - Droits et administration

1. Ajouter routes admin securisees:
   - liste utilisateurs,
   - suppression utilisateur,
   - suppression article forcee.
2. Middleware `requireAdmin` dedie.
3. Page frontend admin minimale (table utilisateurs/articles + actions).
4. Journaliser les actions sensibles (suppression).

Definition of done:
- seuls les admins executent les actions admin,
- controle d'acces teste sur API.

Etat d'avancement (2026-04-19):
- Fait:
  - middleware `requireAdmin`,
  - routes admin API (liste/suppression utilisateurs, liste/suppression articles),
  - page frontend admin minimale (`/admin`),
  - journalisation simple des suppressions (logs serveur),
  - tests ACL admin API (401/403) avec `node:test` + `supertest`.
- Reste a faire:
  - etendre la couverture tests API a auth/articles/ratings.

## Phase 3 - Qualite et securite

1. Ajouter tests API prioritaires (auth + ACL + ratings).
2. Ajouter checks CI (backend build, frontend lint/build, audit backend).
3. Ajouter limite de requetes auth (anti brute force).
4. Verifier CORS/env de prod.

Definition of done:
- pipeline CI vert,
- tests critiques en place,
- garde-fous securite actifs.

Etat d'avancement (2026-04-19):
- Fait:
  - base de tests API avec `node:test` + `supertest`,
  - couverture ACL admin (401/403),
  - couverture auth/articles/ratings sur cas validation + unauthorized.
- Reste a faire:
  - tests d'integration metier avec base de test,
  - CI automatisee lint/build/test:api/audit,
  - rate limiting auth.

## Phase 4 - Mise en ligne publique

Architecture recommandee simple:
- Frontend: Vercel (build Vite)
- Backend: Railway ou Render (Node service)
- DB: PostgreSQL managée (Railway Postgres, Neon, Supabase)

Etapes:
1. Creer DB managée + variables d'environnement backend.
2. Deployer backend (build + start + prisma migrate deploy).
3. Deployer frontend avec `VITE_API_BASE_URL` de prod.
4. Configurer domaine, HTTPS, CORS.
5. Smoke tests post-deploiement.

Definition of done:
- site accessible publiquement,
- inscription/login/publication/notation operationnels en prod.

Etat d'avancement (2026-04-19):
- Fait:
  - architecture cible documentee (Vercel + Railway/Render + PostgreSQL managée),
  - runbook pas-a-pas redige dans `docs/operations/04-deployment-runbook.md`.
- Reste a faire:
  - executer le deploiement reel,
  - ajouter checks CI et smoke tests automatises post-deploiement.

## Risques et decisions

- `avatarUrl` stocke une URL (pas d'upload direct dans l'immediat).
- Upload media (avatar/fichiers) peut etre phase suivante (R2/S3 + signatures).
- Le deploiement est decouple de Docker pour garder une reprise simple.
