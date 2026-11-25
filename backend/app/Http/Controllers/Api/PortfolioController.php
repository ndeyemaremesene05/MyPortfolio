<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Support\PortfolioContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PortfolioController extends Controller
{
    /** GET /api/portfolio : tout le contenu en une requête (utilisé par le frontend). */
    public function show(): JsonResponse
    {
        return response()->json(PortfolioContent::all())
            ->header('Cache-Control', 'public, max-age=300');
    }

    /** GET /api/projects */
    public function projects(): AnonymousResourceCollection
    {
        return ProjectResource::collection(Project::query()->published()->get());
    }

    /** GET /api/projects/{slug} */
    public function project(Project $project): ProjectResource
    {
        abort_unless($project->is_published, 404, 'Projet introuvable.');

        return new ProjectResource($project);
    }

    /** GET /api/skills */
    public function skills(): JsonResponse
    {
        return response()->json(['data' => PortfolioContent::skills()]);
    }

    /** GET /api/timeline */
    public function timeline(): JsonResponse
    {
        return response()->json([
            'data' => PortfolioContent::timeline(),
            'extra' => PortfolioContent::timeline(extra: true),
        ]);
    }
}
