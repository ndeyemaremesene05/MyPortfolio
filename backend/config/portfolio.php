<?php

return [
    // Fichier de contenu partagé avec le frontend (MyPortfolio/content/portfolio.json)
    'content_path' => env('PORTFOLIO_CONTENT_PATH', base_path('../content/portfolio.json')),

    // Adresse qui reçoit une copie des messages du formulaire (vide = pas d'email, messages en base uniquement)
    'contact_notify_email' => env('CONTACT_NOTIFY_EMAIL'),
];
