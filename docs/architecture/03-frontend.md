# 03 - Architecture frontend

## Entree frontend

- Bootstrapping: `src/main.tsx`
- Routing principal: `src/App.tsx`

## Organisation

- `src/pages`: ecrans (index, article, auth, recherche, etc.).
- `src/components`: composants metier wiki + composants UI.
- `src/components/ui`: composants base (shadcn/ui).
- `src/lib`: client API, config runtime, utilitaires.
- `src/hooks`: hooks custom.

## Communication API

- Client central: `src/lib/api.ts`
- Base URL dynamique: `src/lib/config.ts`
- Token JWT stocke en localStorage via `bulbipedia_token`.

## Flux utilisateur majeur

1. Auth utilisateur via `/api/auth/*`.
2. Navigation articles et recherche via `/api/articles`.
3. Actions auteur (create/update) et notation article.

## Risques techniques identifies

- Multiples dependances UI, verifier regulierement la coherence package-lock/pnpm-lock.
- Gestion runtime config (`/api/config`) pouvant fallback sur URL locale.
