<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Même format que content/portfolio.json, attendu par le frontend React. */
class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'subtitle' => $this->subtitle ?? '',
            'tagline' => $this->tagline,
            'type' => $this->type ?? '',
            'period' => $this->period ?? '',
            'status' => $this->status,
            'featured' => $this->featured,
            'visual' => $this->visual,
            'context' => $this->context ?? '',
            'objective' => $this->objective ?? '',
            'contribution' => $this->contribution ?? '',
            'stack' => $this->stack ?? [],
            'architecture' => $this->architecture ?? [],
            'features' => $this->features ?? [],
            'challenges' => $this->challenges ?? [],
            'links' => [
                'demo' => $this->demo_url ?? '',
                'github' => $this->github_url ?? '',
            ],
            'cover' => $this->cover ?? '',
        ];
    }
}
