# 01 - Architecture globale

## Objectif produit

Bulbipedia est une encyclopedie collaborative avec:
- authentification utilisateur,
- publication et edition d'articles,
- notation des articles.

## Vue systeme

- Frontend React/Vite: interface utilisateur, routing, consommation API.
- Backend Express/Prisma: API REST, logique metier, acces base PostgreSQL.
- Base PostgreSQL: persistence des utilisateurs, articles, ratings.

## Flux principal

1. Le frontend envoie des requetes HTTP vers `/api/*`.
2. Le backend valide les entrees (Zod), verifie l'authentification JWT si necessaire.
3. Le backend lit/ecrit via Prisma dans PostgreSQL.
4. Le backend renvoie une reponse JSON exploitee par le frontend.

## Frontieres techniques

- Frontend:
  - dossier: `frontend/src`
  - librairie API: `frontend/src/lib/api.ts`
- Backend:
  - dossier: `backend/src`
  - routes: `backend/src/routes`
  - middleware: `backend/src/middleware`
- Donnees:
  - schema Prisma: `backend/prisma/schema.prisma`

## Decisions de reprise

- Reprise sans Docker a ce stade (setup local PostgreSQL ou DB managée).
- Documentation priorisee pour faciliter la maintenabilite.
- TODO racine utilise comme source de pilotage.
