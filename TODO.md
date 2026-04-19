# TODO - Reprise Bulbipedia

## Routine de debut de session
- [ ] Relire `docs/SESSION_SUMMARY.md`.
- [ ] Relire `docs/README.md` (navigation docs en cascade).
- [ ] Relire `docs/operations/03-project-roadmap.md`.
- [ ] Relire `TODO.md` pour aligner les priorites avant de coder.

## 4) Plan d'action produit (nouveau scope)

### Phase 1 - Comptes utilisateurs complets
- [x] Ajouter `avatarUrl` optionnel sur le modele `User`.
- [x] Mettre a jour auth backend (`register`, `me`) avec `avatarUrl`.
- [x] Mettre a jour le formulaire d'inscription frontend.
- [x] Afficher l'avatar dans le header utilisateur connecte.
- [x] Valider migration + build backend/frontend.
- [ ] Appliquer la migration sur la base cible (`prisma migrate dev` local / `prisma migrate deploy` prod).

### Phase 2 - Capacites utilisateur standard
- [x] Verifier parcours complet user: inscription, connexion, publication, lecture, notation.
- [x] Corriger les ecarts UX/API identifies.
- [x] Documenter le parcours utilisateur cible dans `docs/architecture`.

### Phase 3 - Administration
- [x] Ajouter middleware `requireAdmin`.
- [x] Ajouter endpoints admin: liste/suppression utilisateurs.
- [x] Ajouter endpoint admin de suppression d'article forcee si necessaire.
- [x] Ajouter une page frontend admin minimale.
- [x] Ajouter des tests ACL admin (API).

### Phase 4 - Mise en ligne publique
- [x] Documenter l'architecture de deploiement choisie (frontend/backend/db).
- [x] Ecrire un runbook de deploiement (variables, commandes, checks).
- [ ] Executer le deploiement v1 (frontend + backend + DB managée).
- [ ] Configurer checks de securite et smoke tests post-deploiement.

## 0) Recreer un TODO propre
- [x] Creer ce fichier `TODO.md` comme source de verite de reprise.
- [x] Remplacer l'ancien plan de design non technique (`frontend/todo.md`).

## 1) Analyser et nettoyer le projet
- [x] Lire les README existants (racine, backend, frontend).
- [x] Auditer les scripts, configuration et erreurs IDE.
- [x] Supprimer la configuration Docker pour repartir de zero sur la mise en ligne:
  - [x] `backend/docker-compose.yml`
  - [x] `backend/Dockerfile`
- [x] Supprimer les fichiers de plan obsoletes:
  - [x] `frontend/todo.md`

## 2) Construire une documentation detaillee en cascade
- [x] Creer un index de documentation: `docs/README.md`
- [x] Ajouter une vue d'ensemble architecture: `docs/architecture/01-overview.md`
- [x] Documenter le backend: `docs/architecture/02-backend.md`
- [x] Documenter le frontend: `docs/architecture/03-frontend.md`
- [x] Documenter le modele de donnees: `docs/architecture/04-data-model.md`
- [x] Documenter le setup local sans Docker: `docs/operations/01-local-setup.md`
- [x] Documenter les checks qualite: `docs/operations/02-quality-checks.md`
- [x] Referencer la cascade dans les README principaux.

## 3) Corriger le projet apres analyse
- [x] Mettre a jour la configuration backend exemple pour un PostgreSQL local standard (port 5432).
- [x] Executer les validations de projet (install, build, lint) et corriger les erreurs eventuelles.
- [x] Lister les corrections effectuees et le reste a faire (priorise) dans ce TODO.

## Corrections effectuees
- [x] Suppression des artefacts Docker backend (`Dockerfile`, `docker-compose.yml`).
- [x] Harmonisation des README pour un setup sans Docker.
- [x] Mise a jour `backend/.env.example` vers PostgreSQL local standard (`5432`).
- [x] Suppression de l'ancien plan `frontend/todo.md` non aligne avec la reprise technique.
- [x] Ajout d'une documentation en cascade complete dans `docs/`.
- [x] Remediation controlee des vulnerabilites backend:
  - [x] Upgrade `prisma` -> `^6.19.3`
  - [x] Upgrade `@prisma/client` -> `^6.19.3`
  - [x] Override `path-to-regexp` -> `0.1.13`
  - [x] Verification `npm --prefix backend audit --json` -> 0 vuln
- [x] Validation technique:
  - [x] `npm --prefix backend install`
  - [x] `npm --prefix backend run build`
  - [x] `npm --prefix backend run test:api`
  - [x] `corepack pnpm --dir .\frontend i`
  - [x] `corepack pnpm --dir .\frontend run lint`
  - [x] `corepack pnpm --dir .\frontend run build`

## Reste a faire priorise
1. [x] Definir une strategie de deploiement v1 (hors Docker) documentee dans `docs/operations`.
2. [x] Etendre la suite de tests API (auth + articles + ratings).
3. [ ] Ajouter des checks CI automatiques (lint/build/test:api/audit) pour eviter les regressions.
4. [ ] Ajouter des tests d'integration API avec base de donnees de test (cas metier succes).

## Journal de reprise
- 2026-04-19: nettoyage initial termine (Docker retire, documentation restructuree).
- 2026-04-19: validations techniques executees avec succes (backend build, frontend lint/build).
- 2026-04-19: remediation securite backend terminee (audit passe a 0 vuln).
- 2026-04-19: extension tests API livree (auth/articles/ratings + admin ACL, 10 tests OK).
