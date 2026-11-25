# Mise en ligne

Deux options, à faire dans cet ordre si l'entretien est proche :

| | Option A : site seul | Option B : site + API Laravel + MySQL |
|---|---|---|
| Hébergeur | Vercel (gratuit) | alwaysdata (offre gratuite à vie, usage personnel) |
| Délai | environ 10 minutes | environ 45 minutes |
| Adresse | `xxx.vercel.app` | `xxx.alwaysdata.net` |
| Formulaire | propose d'écrire par email | messages enregistrés en base |
| Montre Laravel en entretien | non (le code est sur GitHub) | oui |

Le site est complet dans les deux cas : le contenu est intégré au build React.

---

## Étape commune : publier le code sur GitHub

1. Sur github.com, créez un dépôt **vide** nommé `MyPortfolio` (sans README, sans .gitignore).
2. Dans le dossier `MyPortfolio` :

```powershell
git init
git add .
git commit -m "Portfolio : frontend React, API Laravel, contenu"
git branch -M main
git remote add origin https://github.com/ndeyemaremesene05/MyPortfolio.git
git push -u origin main
```

Vérifiez avec `git status` avant le commit : `backend/.env`, `backend/vendor` et `frontend/node_modules` ne doivent **pas** apparaître (ils sont dans `.gitignore`).

---

## Option A : le site sur Vercel

1. Créez `frontend/.env.production` (copie de `.env.example`) :
   ```
   VITE_SITE_URL=https://myportfolio-xxx.vercel.app
   VITE_API_URL=
   ```
   `VITE_API_URL` vide = pas d'API, le site utilise le contenu intégré. Vous corrigerez `VITE_SITE_URL` quand Vercel aura donné l'adresse exacte.
2. Testez le build : `cd frontend` puis `npm run build` puis `npm run preview`. Ouvrez l'adresse affichée.
3. Commit et push.
4. Sur vercel.com, connectez-vous avec GitHub, *Add New > Project*, choisissez `MyPortfolio`, puis :
   - **Root Directory** : `frontend`
   - Framework : Vite (détecté)
   - Build command : `npm run build`, Output : `dist`
5. *Deploy*. Une fois en ligne, mettez la vraie adresse dans `VITE_SITE_URL`, commit, push : Vercel redéploie seul.

`frontend/vercel.json` est déjà prêt : les adresses comme `/projets/eventia` fonctionnent même en rechargeant la page.

---

## Option B : tout le portfolio sur alwaysdata

Laravel sert l'API **et** le site React sur la même adresse. Pas de CORS à gérer.

### 1. Préparer le build sur votre PC

```powershell
cd frontend
# frontend/.env.production :
#   VITE_SITE_URL=https://VOTRE-COMPTE.alwaysdata.net
#   VITE_API_URL=/api
npm run build:laravel
cd ..
git add .
git commit -m "Build du site pour Laravel"
git push
```

`build:laravel` copie le site dans `backend/public/` (la page devient `app.html`). Ces fichiers sont versionnés exprès : le serveur n'a pas besoin de Node.

### 2. Créer le compte et la base

1. Inscription sur alwaysdata.com, offre **Free**. Le nom du compte donne l'adresse `VOTRE-COMPTE.alwaysdata.net`.
2. Dans l'administration : *Bases de données > MySQL* : créez une base (ex. `VOTRE-COMPTE_portfolio`) et un utilisateur avec mot de passe. Notez l'hôte MySQL affiché (de la forme `mysql-VOTRE-COMPTE.alwaysdata.net`).
3. *Accès distant > SSH* : activez la connexion par mot de passe pour l'utilisateur.
4. *Environnement* (ou *Sites > PHP*) : choisissez **PHP 8.4**.

### 3. Installer le code par SSH

Depuis le terminal de votre PC :

```bash
ssh VOTRE-COMPTE@ssh-VOTRE-COMPTE.alwaysdata.net
```

Puis sur le serveur :

```bash
git clone https://github.com/ndeyemaremesene05/MyPortfolio.git
cd MyPortfolio/backend
composer install --no-dev --optimize-autoloader
```

> Si `composer` n'est pas reconnu : `curl -sS https://getcomposer.org/installer | php` puis `php composer.phar install --no-dev --optimize-autoloader`.

Créez `backend/.env` :

```bash
cp .env.example .env
nano .env
```

Valeurs à mettre :

```
APP_NAME="Ndeye Mareme Sene"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://VOTRE-COMPTE.alwaysdata.net

DB_CONNECTION=mysql
DB_HOST=mysql-VOTRE-COMPTE.alwaysdata.net
DB_PORT=3306
DB_DATABASE=VOTRE-COMPTE_portfolio
DB_USERNAME=...
DB_PASSWORD=...

FRONTEND_URL=https://VOTRE-COMPTE.alwaysdata.net
CONTACT_NOTIFY_EMAIL=ndeyemaremesene33@gmail.com
```

Puis :

```bash
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php artisan config:cache
php artisan route:cache
```

### 4. Brancher le site

Administration > *Web > Sites* > modifiez le site par défaut :
- Type : **PHP**
- Répertoire racine : `/MyPortfolio/backend/public` (le chemin part de votre dossier personnel)
- Version PHP : 8.4

### 5. Vérifier

- `https://VOTRE-COMPTE.alwaysdata.net/api/health` répond `{"status":"ok"}`
- `https://VOTRE-COMPTE.alwaysdata.net/` affiche le portfolio
- `https://VOTRE-COMPTE.alwaysdata.net/projets/eventia` fonctionne, même en rechargeant
- `https://VOTRE-COMPTE.alwaysdata.net/nimporte-quoi` affiche la page 404
- Envoyez un message test avec le formulaire, puis sur le serveur : `php artisan contact:messages`

### Mettre à jour plus tard

PC : modifier, `npm run build:laravel` si le frontend a changé, commit, push. Serveur :

```bash
cd ~/MyPortfolio && git pull
cd backend && composer install --no-dev --optimize-autoloader
php artisan migrate --force && php artisan db:seed --force
php artisan config:cache && php artisan route:cache
```

---

## Après la mise en ligne

- Remplacez `siteUrl` dans `content/portfolio.json` par l'adresse finale.
- Testez l'aperçu LinkedIn sur linkedin.com/post-inspector avec l'adresse du site.
- Déclarez le site dans Google Search Console et envoyez `https://.../sitemap.xml`.
