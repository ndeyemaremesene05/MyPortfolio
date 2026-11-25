# Installe le backend Laravel du portfolio (Windows + Laragon).
# A lancer depuis le dossier MyPortfolio, dans un terminal ouvert APRES avoir choisi PHP 8.3+ dans Laragon :
#   powershell -ExecutionPolicy Bypass -File .\setup-backend.ps1
# MySQL doit etre demarre dans Laragon (bouton "Demarrer tout").

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

function Step($message) { Write-Host "`n==> $message" -ForegroundColor Cyan }
function Fail($message) { Write-Host "`nERREUR : $message" -ForegroundColor Red; exit 1 }

Step 'Vérification des outils'
$phpVersion = (php -r 'echo PHP_VERSION;')
Write-Host "PHP $phpVersion"
if ([version]($phpVersion -replace '[^0-9.].*$', '') -lt [version]'8.3.0') {
    Fail "PHP $phpVersion détecté. Laravel 13 demande PHP 8.3 ou plus. Dans Laragon : Menu > PHP > Version, choisissez 8.3 ou 8.4, puis ouvrez un NOUVEAU terminal."
}
composer --version
node -v
npm -v

if (Test-Path 'backend') { Fail "Le dossier backend existe déjà. Rien n'a été modifié. Supprimez-le vous-même si vous voulez recommencer." }
if (-not (Test-Path 'backend-files')) { Fail 'Dossier backend-files introuvable. Lancez ce script depuis le dossier MyPortfolio.' }

Step 'Création du projet Laravel (quelques minutes)'
composer create-project laravel/laravel backend --no-interaction
if ($LASTEXITCODE -ne 0) { Fail 'composer create-project a échoué (voir le message ci-dessus).' }

Step 'Ajout des fichiers du portfolio dans backend'
robocopy 'backend-files' 'backend' /E /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { Fail 'La copie de backend-files vers backend a échoué.' }

Step 'Configuration de backend\.env pour MySQL (Laragon : utilisateur root, sans mot de passe)'
Set-Location 'backend'
$envPath = Join-Path (Get-Location) '.env'
$lines = Get-Content $envPath | Where-Object { $_ -notmatch '^\s*#?\s*DB_' -and $_ -notmatch '^(FRONTEND_URL|CONTACT_NOTIFY_EMAIL)=' }
$lines += @(
    '',
    'DB_CONNECTION=mysql',
    'DB_HOST=127.0.0.1',
    'DB_PORT=3306',
    'DB_DATABASE=myportfolio',
    'DB_USERNAME=root',
    'DB_PASSWORD=',
    '',
    '# Portfolio',
    'FRONTEND_URL=http://localhost:5173',
    'CONTACT_NOTIFY_EMAIL='
)
[System.IO.File]::WriteAllLines($envPath, $lines)

Step 'Création de la base de données myportfolio'
mysql -u root -e "CREATE DATABASE IF NOT EXISTS myportfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if ($LASTEXITCODE -ne 0) { Fail "Impossible de joindre MySQL. Démarrez-le dans Laragon (Démarrer tout), puis lancez dans backend : php artisan migrate ; php artisan db:seed" }

Step 'Migrations et import du contenu'
php artisan migrate --force
if ($LASTEXITCODE -ne 0) { Fail 'php artisan migrate a échoué (voir ci-dessus).' }
php artisan db:seed --force
if ($LASTEXITCODE -ne 0) { Fail 'php artisan db:seed a échoué (voir ci-dessus).' }

Step 'Tests automatiques'
$phpunit = Get-Content 'phpunit.xml' -Raw
$sqliteMemory = $phpunit -match '<env name="DB_DATABASE" value=":memory:"\s*/>' -and $phpunit -notmatch '<!--\s*<env name="DB_DATABASE" value=":memory:"'
$hasSqlite = (php -m) -contains 'pdo_sqlite'
if ($sqliteMemory -and $hasSqlite) {
    php artisan test
} else {
    Write-Host 'Tests ignorés : ils doivent tourner sur une base SQLite en mémoire (sinon ils videraient la base MySQL).' -ForegroundColor Yellow
    Write-Host 'Vérifiez dans phpunit.xml que DB_CONNECTION=sqlite et DB_DATABASE=:memory: ne sont pas en commentaire, et activez pdo_sqlite dans Laragon (Menu > PHP > Extensions).' -ForegroundColor Yellow
}

Step 'Installation du frontend'
Set-Location '..\frontend'
if (-not (Test-Path '.env')) {
    [System.IO.File]::WriteAllLines((Join-Path (Get-Location) '.env'), @(
        '# Valeurs pour le développement local. Pour la production : .env.production (voir .env.example)',
        'VITE_SITE_URL=http://localhost:5173',
        'VITE_API_URL=/api'
    ))
}
npm install
if ($LASTEXITCODE -ne 0) { Fail 'npm install a échoué (voir ci-dessus).' }

Set-Location $PSScriptRoot
Write-Host "`nTerminé. Pour lancer le portfolio en local, ouvrez deux terminaux :" -ForegroundColor Green
Write-Host '  1) cd backend   puis   php artisan serve'
Write-Host '  2) cd frontend  puis   npm run dev'
Write-Host 'Puis ouvrez http://localhost:5173'
