# 04 - Modele de donnees

## Source canonique

Le schema de donnees est defini dans `backend/prisma/schema.prisma`.

## Entites principales

- User
- Article
- Rating

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
- Les validators backend doivent etre synchronises avec les nouvelles contraintes.
- Les pages frontend consommant les champs modifies doivent etre mises a jour.
