<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    public const STATUSES = ['realise', 'en_cours', 'prototype', 'prevu'];

    protected $fillable = [
        'slug', 'name', 'subtitle', 'tagline', 'type', 'period', 'status', 'featured', 'visual',
        'context', 'objective', 'contribution', 'stack', 'architecture', 'features', 'challenges',
        'demo_url', 'github_url', 'cover', 'position', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'featured' => 'boolean',
            'is_published' => 'boolean',
            'stack' => 'array',
            'architecture' => 'array',
            'features' => 'array',
            'challenges' => 'array',
            'position' => 'integer',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)->orderBy('position');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
