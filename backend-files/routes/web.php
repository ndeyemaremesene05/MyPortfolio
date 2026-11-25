<?php

use App\Models\Project;
use Illuminate\Support\Facades\Route;

/*
| Le site React (build copié dans public/ par "npm run build:laravel") est servi ici.
| public/app.html = page React. Les fichiers réels (assets, CV, images) sont servis
| directement par le serveur web, avant d'arriver à Laravel.
*/
Route::get('/{path?}', function (?string $path = null) {
    $app = public_path('app.html');

    if (! is_file($app)) {
        return response()->json([
            'message' => 'API du portfolio en ligne. Le site React n’est pas encore copié dans public/ (lancez "npm run build:laravel" dans frontend).',
            'api' => url('/api/portfolio'),
        ]);
    }

    $path = trim((string) $path, '/');
    $known = $path === ''
        || (preg_match('#^projets/([a-z0-9-]+)$#', $path, $m) === 1
            && Project::query()->where('slug', $m[1])->where('is_published', true)->exists());

    // Même page React dans tous les cas ; code 404 pour les adresses inconnues (bon pour le SEO).
    return response()->file($app, ['Content-Type' => 'text/html; charset=UTF-8'])
        ->setStatusCode($known ? 200 : 404);
})->where('path', '^(?!api(/|$)|up$).*$');
