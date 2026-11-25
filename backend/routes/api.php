<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\PortfolioController;
use Illuminate\Support\Facades\Route;

// Toutes ces routes sont préfixées par /api

Route::get('/health', fn () => response()->json(['status' => 'ok', 'time' => now()->toIso8601String()]));

Route::get('/portfolio', [PortfolioController::class, 'show']);
Route::get('/projects', [PortfolioController::class, 'projects']);
Route::get('/projects/{project}', [PortfolioController::class, 'project']);
Route::get('/skills', [PortfolioController::class, 'skills']);
Route::get('/timeline', [PortfolioController::class, 'timeline']);

Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:contact');
