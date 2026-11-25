<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimelineEntry extends Model
{
    protected $fillable = ['kind', 'period', 'title', 'place', 'detail', 'project_slug', 'is_extra', 'position'];

    protected function casts(): array
    {
        return ['is_extra' => 'boolean', 'position' => 'integer'];
    }

    /** Même format que content/portfolio.json, attendu par le frontend. */
    public function toContent(): array
    {
        return array_filter([
            'kind' => $this->kind,
            'period' => $this->period ?? '',
            'title' => $this->title,
            'place' => $this->place ?? '',
            'detail' => $this->detail ?? '',
            'projectSlug' => $this->project_slug,
        ], fn ($value) => $value !== null);
    }
}
