<?php

namespace App\Support;

use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\Setting;
use App\Models\SkillCategory;
use App\Models\TimelineEntry;
use Illuminate\Support\Facades\Cache;

/**
 * Assemble tout le contenu du portfolio depuis MySQL, au même format que
 * content/portfolio.json. Mis en cache ; le cache est vidé par le seeder.
 */
class PortfolioContent
{
    public const CACHE_KEY = 'portfolio.content';

    public static function all(): array
    {
        return Cache::remember(self::CACHE_KEY, now()->addMinutes(30), fn () => self::build());
    }

    public static function forget(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    public static function skills(): array
    {
        return SkillCategory::query()
            ->with('skills')
            ->orderBy('position')
            ->get()
            ->map(fn (SkillCategory $category) => [
                'slug' => $category->slug,
                'name' => $category->name,
                'summary' => $category->summary ?? '',
                'skills' => $category->skills
                    ->map(fn ($skill) => ['name' => $skill->name, 'level' => $skill->level])
                    ->values()
                    ->all(),
            ])
            ->all();
    }

    public static function timeline(bool $extra = false): array
    {
        return TimelineEntry::query()
            ->where('is_extra', $extra)
            ->orderBy('position')
            ->get()
            ->map(fn (TimelineEntry $entry) => $entry->toContent())
            ->all();
    }

    private static function build(): array
    {
        $projects = Project::query()->published()->get();

        return [
            'profile' => Setting::fetch('profile', []),
            'levels' => Setting::fetch('levels', []),
            'skillCategories' => self::skills(),
            'projects' => ProjectResource::collection($projects)->resolve(),
            'erp' => Setting::fetch('erp'),
            'versatility' => Setting::fetch('versatility', []),
            'timeline' => self::timeline(),
            'timelineExtra' => self::timeline(extra: true),
        ];
    }
}
