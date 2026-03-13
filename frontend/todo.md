# Bulbipédia - Wiki Pokémon inspiré de Bulbizarre

## Design Guidelines

### Design References
- **Wikipedia.org**: Structure wiki classique, table des matières, infobox
- **Bulbapedia.bulbagarden.net**: Wiki Pokémon de référence
- **Style**: Wiki encyclopédique moderne avec thème Bulbizarre (vert/turquoise)

### Color Palette (inspirée de Bulbizarre)
- Primary: #2D8B5E (Vert forêt - corps de Bulbizarre)
- Secondary: #4CAF7D (Vert clair - nuances du corps)
- Accent: #1B5E3B (Vert foncé - bulbe/feuilles)
- Highlight: #7ED4A6 (Vert menthe - hover/accents)
- Background: #F0F7F3 (Vert très pâle - fond principal)
- Surface: #FFFFFF (Blanc - cartes/articles)
- Text Primary: #1A2E23 (Vert très foncé - texte principal)
- Text Secondary: #4A6B57 (Vert gris - texte secondaire)
- Border: #C8E6D5 (Vert pâle - bordures)
- Link: #1B7A4A (Vert lien - liens wiki)
- Red Accent: #E85D5D (Rouge - taches de Bulbizarre, alertes)

### Typography
- Heading1: "Linux Libertine", Georgia, serif - font-weight 700 (32px) - style wiki
- Heading2: "Linux Libertine", Georgia, serif - font-weight 600 (24px)
- Heading3: Inter, sans-serif - font-weight 600 (20px)
- Body: Inter, sans-serif - font-weight 400 (15px)
- Navigation: Inter, sans-serif - font-weight 500 (14px)
- Monospace: "Fira Code", monospace (pour données techniques)

### Key Component Styles
- **Wiki Header**: Fond vert foncé #1B5E3B, texte blanc, logo à gauche
- **Search Bar**: Grande barre centrale, bordure verte, icône loupe
- **Article Cards**: Fond blanc, bordure gauche verte 3px, ombre légère
- **Infobox**: Bordure verte, header vert foncé, fond vert pâle
- **Table des matières**: Fond #F0F7F3, bordure verte, sticky sidebar
- **Catégories badges**: Fond vert pâle, texte vert foncé, arrondi
- **Liens wiki**: Couleur #1B7A4A, underline on hover

### Layout
- Header fixe avec navigation
- Sidebar gauche pour navigation wiki (desktop)
- Contenu principal centré max-width 1200px
- Infobox flottante à droite dans les articles
- Footer avec stats et liens

### Images to Generate
1. **hero-bulbasaur-garden.jpg** - Bulbizarre dans un jardin luxuriant avec des plantes et fleurs, style illustration anime/aquarelle, ambiance encyclopédique (Style: watercolor, 1024x576)
2. **logo-bulbipedia.png** - Logo "Bulbipédia" avec un bulbe/graine stylisé vert, design encyclopédique propre et moderne (Style: minimalist, 1024x1024)
3. **category-pokeball-forest.jpg** - Pokéball posée dans une forêt verdoyante avec mousse et feuilles, ambiance nature (Style: photorealistic, 1024x576)
4. **banner-pokemon-types.jpg** - Illustration colorée montrant différents types de Pokémon (feu, eau, plante, électrique) sous forme d'icônes stylisées sur fond vert (Style: minimalist, 1024x576)

---

## Development Tasks

### Fichiers à créer:
1. **index.html** - Mettre à jour le titre "Bulbipédia"
2. **src/index.css** - Styles globaux wiki, variables CSS Bulbizarre
3. **src/components/WikiHeader.tsx** - Header avec logo, recherche, navigation
4. **src/components/WikiSidebar.tsx** - Sidebar navigation wiki
5. **src/components/WikiInfobox.tsx** - Infobox style wiki pour Pokémon
6. **src/components/WikiArticle.tsx** - Composant article wiki avec table des matières
7. **src/pages/Index.tsx** - Page d'accueil avec recherche, article du jour, catégories
8. **src/pages/ArticlePage.tsx** - Page d'article wiki (Bulbizarre comme exemple)
9. **src/pages/CategoryPage.tsx** - Page de catégories
10. **src/pages/SearchPage.tsx** - Page de résultats de recherche
11. **src/App.tsx** - Routes mises à jour

### Relations:
- Index.tsx utilise WikiHeader, WikiSidebar
- ArticlePage.tsx utilise WikiHeader, WikiSidebar, WikiInfobox, WikiArticle
- CategoryPage.tsx utilise WikiHeader, WikiSidebar
- SearchPage.tsx utilise WikiHeader, WikiSidebar
- Tous partagent le même layout (header + sidebar + contenu)