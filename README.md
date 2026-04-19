# Bulbipedia

Projet d'encyclopedie en ligne avec frontend React et backend Node.js/Express.

## Structure

- `frontend/`: app React + Vite + TypeScript
- `backend/`: API REST Express + Prisma + PostgreSQL
- `docs/`: documentation technique en cascade
- `TODO.md`: feuille de route de reprise

## Demarrage rapide

### 1) Frontend

```powershell
corepack pnpm --dir .\frontend i
corepack pnpm --dir .\frontend run dev
```

### 2) Backend (sans Docker)

Prerequis:
- Node.js 22+
- PostgreSQL accessible en local ou a distance

```powershell
Copy-Item .\backend\.env.example .\backend\.env
npm --prefix backend install
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate -- --name init
npm --prefix backend run prisma:seed
npm --prefix backend run dev
```

Backend: `http://localhost:4000`

## Documentation

- Index docs: `docs/README.md`
- Architecture globale: `docs/architecture/01-overview.md`
- Setup local: `docs/operations/01-local-setup.md`
- Checks qualite: `docs/operations/02-quality-checks.md`

## Reprise du projet

Le plan de reprise est suivi dans `TODO.md`.
