# Bulbipedia Frontend

Frontend React + Vite de l'encyclopedie.

## Stack technique

- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS

Les composants UI sont dans `src/components/ui`.

## Demarrage rapide (Windows)

Depuis la racine du projet (`Bulbipedia`), lance:

```powershell
corepack pnpm --dir .\frontend i
corepack pnpm --dir .\frontend run dev
```

Puis ouvre:

- `http://localhost:3000`

## Variante (si dans le dossier frontend)

```powershell
corepack pnpm i
corepack pnpm run dev
```

## Commandes utiles

Installer les dependances:

```powershell
corepack pnpm i
```

Lancer en developpement:

```powershell
corepack pnpm run dev
```

Build de production:

```powershell
corepack pnpm run build
```

Preview du build:

```powershell
corepack pnpm run preview
```

## Structure principale

- `index.html` : point d'entree HTML
- `vite.config.ts` : configuration Vite
- `package.json` : scripts et dependances
- `src/main.tsx` : point d'entree React
- `src/App.tsx` : composition principale de l'app
- `src/index.css` : styles globaux

## Notes importantes

- L'alias `@` pointe vers `src`.
- Il faut utiliser `vite.config.ts` pour que l'alias fonctionne.
- Le frontend appelle le backend sur `http://127.0.0.1:4000` par defaut.
- Tu peux surcharger l'URL via `VITE_API_BASE_URL`.

## Depannage

Si `pnpm` n'est pas reconnu:

```powershell
corepack pnpm -v
```

Si tu vois l'erreur "No package.json found":

- Soit place-toi dans `frontend` avant de lancer les commandes.
- Soit utilise `--dir` comme dans la section "Demarrage rapide".
