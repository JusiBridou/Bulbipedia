# 02 - Verification qualite

## Objectif

Verifier rapidement que le projet est executable apres modifications.

## Backend

```powershell
npm --prefix backend install
npm --prefix backend run build
npm --prefix backend run test:api
npm --prefix backend audit --json
```

`test:api` couvre actuellement les cas ACL/validation critiques (auth, admin, articles, ratings).

Optionnel en dev:

```powershell
npm --prefix backend run dev
```

## Frontend

```powershell
corepack pnpm --dir .\frontend i
corepack pnpm --dir .\frontend run lint
corepack pnpm --dir .\frontend run build
```

## Checklist de validation

- Build backend OK.
- Tests API backend OK.
- Audit backend OK (0 vulnerability).
- Lint frontend OK.
- Build frontend OK.
- App frontend charge sans erreur console bloquante.
- Backend repond sur `/api/health`.

## Politique upgrades backend

1. Relever les mises a jour disponibles: `npm --prefix backend outdated`.
2. Prioriser les upgrades patch/minor compatibles.
3. Si une vuln transitive persiste, utiliser `overrides` de maniere documentee.
4. Revalider avec `build` puis `audit` avant de fusionner.

## En cas d'echec

1. Corriger l'erreur localement.
2. Relancer uniquement la commande en echec.
3. Mettre a jour `TODO.md` avec la correction appliquee.
