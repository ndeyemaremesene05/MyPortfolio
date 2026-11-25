# MyPortfolio

Portfolio de **Ndeye Mareme Sene**, développeuse full stack web, mobile et IA.

- **Frontend** : React 19, Vite, Tailwind CSS 4, React Router
- **Backend** : Laravel 13 (API REST), MySQL
- **Contenu** : un seul fichier, `content/portfolio.json`, lu par React et importé dans MySQL par Laravel

```
MyPortfolio/
├── content/portfolio.json   ← TOUT le texte du site (profil, compétences, projets, parcours)
├── frontend/                ← site React (Vite + Tailwind)
├── backend-files/           ← fichiers à ajouter à un Laravel neuf (copiés par setup-backend.ps1, supprimable ensuite)
├── backend/                 ← projet Laravel (créé par setup-backend.ps1)
├── setup-backend.ps1        ← installation du backend sous Windows / Laragon
└── docs/DEPLOIEMENT.md      ← mise en ligne pas à pas
```

## Prérequis

| Outil | Version | Vérifier avec |
|---|---|---|
| PHP | **8.3 ou plus** (Laravel 13) | `php -v` |
| Composer | 2.x | `composer -V` |
| Node.js | 20.19+ (testé avec 22 et 24) | `node -v` |
| MySQL | 8 (Laragon) | `mysql --version` |
| Git | récent | `git --version` |

PHP 8.1 ne suffit pas. Dans Laragon : *Menu > PHP > Version* et choisissez 8.3 ou 8.4. Si elle n'apparaît pas, téléchargez le zip **VS17 x64 Thread Safe** sur windows.php.net, décompressez-le dans `C:\laragon\bin\php\`, puis sélectionnez-le. Ouvrez ensuite un **nouveau** terminal.

## Installation (une seule fois)

Dans le dossier `MyPortfolio`, MySQL démarré dans Laragon :

```powershell
powershell -ExecutionPolicy Bypass -File .\setup-backend.ps1
```

Le script crée le projet Laravel dans `backend/`, y ajoute les fichiers de `backend-files/`, configure MySQL (base `myportfolio`), lance les migrations, importe le contenu, lance les tests et installe le frontend.

<details>
<summary>Faire la même chose à la main</summary>

```powershell
composer create-project laravel/laravel backend
robocopy backend-files backend /E
cd backend
# Dans .env : DB_CONNECTION=mysql, DB_DATABASE=myportfolio, DB_USERNAME=root, DB_PASSWORD=
mysql -u root -e "CREATE DATABASE myportfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
php artisan migrate
php artisan db:seed
php artisan test
cd ..\frontend
npm install
```
</details>

## Lancer en local

Deux terminaux :

```powershell
# Terminal 1
cd backend
php artisan serve          # API sur http://127.0.0.1:8000

# Terminal 2
cd frontend
npm run dev                # site sur http://localhost:5173
```

Vite redirige `/api` vers Laravel. Si Laravel n'est pas lancé, le site fonctionne quand même avec le contenu intégré (seul le formulaire propose alors d'écrire par email).

## Modifier le contenu

1. Modifiez `content/portfolio.json` (textes, compétences, niveaux, projets, statuts, liens).
2. Réimportez dans la base : `cd backend` puis `php artisan db:seed`.
3. Le frontend se met à jour tout seul en mode `npm run dev`.

Une valeur vide (`""`) masque l'élément. Exemples :
- `"showPhone": true` pour afficher le téléphone dans Contact ;
- `"links": { "demo": "https://..." }` pour ajouter un bouton « Voir le projet » ;
- `"cover": "/projets/eventia.webp"` pour remplacer l'illustration par une vraie capture (fichier à placer dans `frontend/public/projets/`) ;
- `"erp": { "modules": ["Ventes", "Stock"] }` pour lister les modules Odoo explorés.

Statuts de projet et de fonctionnalité : `realise`, `en_cours`, `prototype`, `prevu`.
Niveaux de compétence : `projet`, `pratique`, `approfondissement`, `connaissances`.

Le schéma de base de données affiché sur le site est dans `frontend/src/data/schema.js` (tables, relations, requêtes SQL).

## Le CV

Placez le PDF ici : `frontend/public/cv/CV_Ndeye_Mareme_Sene.pdf`. Tant qu'il n'y est pas, les boutons « Télécharger mon CV » mènent à une page vide.

## API

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/api/health` | Vérifier que l'API répond |
| GET | `/api/portfolio` | Tout le contenu en une requête (utilisé par le site) |
| GET | `/api/projects` | Liste des projets |
| GET | `/api/projects/{slug}` | Un projet (404 si inconnu) |
| GET | `/api/skills` | Compétences par catégorie |
| GET | `/api/timeline` | Parcours |
| POST | `/api/contact` | Formulaire de contact (validation, 3 envois/min par IP, champ piège anti-robots) |

Les messages reçus sont enregistrés dans la table `contact_messages`. Pour les lire :

```powershell
php artisan contact:messages --unread --mark-read
```

Pour recevoir aussi une copie par email, renseignez `CONTACT_NOTIFY_EMAIL` et la configuration `MAIL_*` dans `backend/.env`.

## Commandes utiles

| Où | Commande | Rôle |
|---|---|---|
| frontend | `npm run dev` | développement |
| frontend | `npm run build` | build de production dans `dist/` (lit `.env.production`) |
| frontend | `npm run build:laravel` | build + copie dans `backend/public/` (Laravel sert alors le site) |
| frontend | `npm run lint` | vérification du code |
| backend | `php artisan test` | 8 tests de l'API |
| backend | `php artisan db:seed` | réimporter `content/portfolio.json` |

## Mise en ligne

Voir [docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md).
