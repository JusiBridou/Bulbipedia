# 02 - Verification qualite

## Objectif

Verifier rapidement que le projet est executable apres modifications.

## Backend

```powershell
npm --prefix backend install
npm --prefix backend run build
```

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
- Lint frontend OK.
- Build frontend OK.
- App frontend charge sans erreur console bloquante.
- Backend repond sur `/api/health`.

## En cas d'echec

1. Corriger l'erreur localement.
2. Relancer uniquement la commande en echec.
3. Mettre a jour `TODO.md` avec la correction appliquee.
