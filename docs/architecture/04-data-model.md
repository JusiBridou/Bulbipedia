# 04 - Modele de donnees

## Source canonique

Le schema de donnees est defini dans `backend/prisma/schema.prisma`.

## Entites principales

- User
- Article
- Rating

## Champs notables

- User:
	- `email` (unique)
	- `username` (unique)
	- `passwordHash`
	- `role` (`USER` ou `ADMIN`)
	- `avatarUrl` (optionnel, chemin ou URL image de profil)
- Article:
	- `slug` (unique)
	- `title`
	- `summary` (optionnel)
	- `content`
	- `heroImageUrl` (optionnel, chemin ou URL image d'en-tete)
	- `published` / `publishedAt`

## Relations metier

- Un User peut ecrire plusieurs Article.
- Un Article appartient a un User (auteur).
- Un User peut noter un Article via Rating.
- Les stats de notation d'un Article sont derivees des lignes Rating.

## Invariants metier attendus

- Email utilisateur unique.
- Username unique.
- Slug article unique.
- Une note par paire (user, article) si contrainte unique definie dans Prisma.

## Impacts lors des evolutions

- Toute evolution de schema doit passer par migration Prisma.
- Si une migration ajoute un champ optionnel visible dans l'API, verifier aussi les routes qui lisent les articles, le profil auteur et l'administration.
- Les validators backend doivent etre synchronises avec les nouvelles contraintes.
- Les pages frontend consommant les champs modifies doivent etre mises a jour.
- Les champs medias peuvent pointer vers des fichiers backend (`/uploads/*`) ou des URLs externes legacy.
