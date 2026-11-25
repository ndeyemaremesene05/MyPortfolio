# Frontend du portfolio (React + Vite + Tailwind CSS)

Voir le README à la racine de MyPortfolio pour l'installation et les commandes.

```
src/
├── main.jsx            routes : /, /projets/:slug, 404
├── App.jsx             mise en page (barre de navigation, pied de page)
├── lib/api.js          appels à l'API Laravel, avec solution de repli
├── lib/content.jsx     contenu : intégré au build, remplacé par l'API si elle répond
├── data/schema.js      schéma de la base Eventia et requêtes SQL affichées
├── components/         éléments réutilisables (boutons, badges, schéma, illustrations)
├── sections/           sections de la page d'accueil
└── pages/              accueil, page projet, 404
```
