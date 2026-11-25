<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Setting;
use App\Models\SkillCategory;
use App\Models\TimelineEntry;
use App\Support\PortfolioContent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * Importe content/portfolio.json dans la base.
 * Relançable sans risque : le contenu est remplacé, les messages de contact sont conservés.
 *
 *   php artisan db:seed --class=PortfolioSeeder
 */
class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        $path = config('portfolio.content_path');

        if (! is_file($path)) {
            throw new RuntimeException("Fichier de contenu introuvable : {$path}. Vérifiez PORTFOLIO_CONTENT_PATH dans .env");
        }

        $content = json_decode(file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);

        DB::transaction(function () use ($content) {
            // Suppression dans l'ordre des clés étrangères (skills -> skill_categories)
            SkillCategory::query()->each(fn ($category) => $category->skills()->delete());
            SkillCategory::query()->delete();
            Project::query()->delete();
            TimelineEntry::query()->delete();

            foreach (['profile', 'levels', 'erp', 'versatility'] as $key) {
                Setting::updateOrCreate(['key' => $key], ['value' => $content[$key] ?? null]);
            }

            foreach ($content['skillCategories'] ?? [] as $i => $category) {
                $model = SkillCategory::create([
                    'slug' => $category['slug'],
                    'name' => $category['name'],
                    'summary' => $category['summary'] ?? null,
                    'position' => $i,
                ]);

                foreach ($category['skills'] ?? [] as $j => $skill) {
                    $model->skills()->create([
                        'name' => $skill['name'],
                        'level' => $skill['level'],
                        'position' => $j,
                    ]);
                }
            }

            foreach ($content['projects'] ?? [] as $i => $project) {
                Project::create([
                    'slug' => $project['slug'],
                    'name' => $project['name'],
                    'subtitle' => ($project['subtitle'] ?? '') ?: null,
                    'tagline' => $project['tagline'],
                    'type' => $project['type'] ?? null,
                    'period' => $project['period'] ?? null,
                    'status' => in_array($project['status'] ?? '', Project::STATUSES, true) ? $project['status'] : 'en_cours',
                    'featured' => (bool) ($project['featured'] ?? false),
                    'visual' => $project['visual'] ?? null,
                    'context' => $project['context'] ?? null,
                    'objective' => $project['objective'] ?? null,
                    'contribution' => $project['contribution'] ?? null,
                    'stack' => $project['stack'] ?? [],
                    'architecture' => $project['architecture'] ?? [],
                    'features' => $project['features'] ?? [],
                    'challenges' => $project['challenges'] ?? [],
                    'demo_url' => ($project['links']['demo'] ?? '') ?: null,
                    'github_url' => ($project['links']['github'] ?? '') ?: null,
                    'cover' => ($project['cover'] ?? '') ?: null,
                    'position' => $i,
                ]);
            }

            foreach ([false => 'timeline', true => 'timelineExtra'] as $isExtra => $key) {
                foreach ($content[$key] ?? [] as $i => $entry) {
                    TimelineEntry::create([
                        'kind' => $entry['kind'],
                        'period' => ($entry['period'] ?? '') ?: null,
                        'title' => $entry['title'],
                        'place' => ($entry['place'] ?? '') ?: null,
                        'detail' => ($entry['detail'] ?? '') ?: null,
                        'project_slug' => $entry['projectSlug'] ?? null,
                        'is_extra' => (bool) $isExtra,
                        'position' => $i,
                    ]);
                }
            }
        });

        PortfolioContent::forget();

        $this->command?->info(sprintf(
            'Portfolio importé : %d projets, %d catégories de compétences, %d entrées de parcours.',
            Project::count(),
            SkillCategory::count(),
            TimelineEntry::count(),
        ));
    }
}
