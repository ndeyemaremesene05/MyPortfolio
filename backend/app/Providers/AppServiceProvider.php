<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Formulaire de contact : 3 envois par minute et 20 par jour, par adresse IP
        RateLimiter::for('contact', function (Request $request) {
            return [
                Limit::perMinute(3)->by('contact-min:'.$request->ip()),
                Limit::perDay(20)->by('contact-day:'.$request->ip()),
            ];
        });
    }
}
