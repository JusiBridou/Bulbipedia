# TODO - Reprise Bulbipedia

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
- [x] Validation technique:
  - [x] `npm --prefix backend install`
  - [x] `npm --prefix backend run build`
  - [x] `corepack pnpm --dir .\frontend i`
  - [x] `corepack pnpm --dir .\frontend run lint`
  - [x] `corepack pnpm --dir .\frontend run build`

## Reste a faire priorise
1. [ ] Traiter la securite des dependances backend (`npm audit` signale 5 vulnerabilites high).
2. [ ] Definir une strategie de deploiement v1 (hors Docker) documentee dans `docs/operations`.
3. [ ] Ajouter une suite minimale de tests API (auth + articles + ratings).
4. [ ] Ajouter des checks CI automatiques (lint/build) pour eviter les regressions.

## Journal de reprise
- 2026-04-19: nettoyage initial termine (Docker retire, documentation restructuree).
- 2026-04-19: validations techniques executees avec succes (backend build, frontend lint/build).
