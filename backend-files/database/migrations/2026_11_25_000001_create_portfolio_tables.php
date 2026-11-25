<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 80)->unique();
            $table->string('name', 120);
            $table->string('subtitle', 120)->nullable();
            $table->text('tagline');
            $table->string('type', 120)->nullable();
            $table->string('period', 60)->nullable();
            $table->string('status', 20)->default('en_cours'); // realise | en_cours | prototype | prevu
            $table->boolean('featured')->default(false);
            $table->string('visual', 40)->nullable();
            $table->text('context')->nullable();
            $table->text('objective')->nullable();
            $table->text('contribution')->nullable();
            $table->json('stack')->nullable();
            $table->json('architecture')->nullable();
            $table->json('features')->nullable();
            $table->json('challenges')->nullable();
            $table->string('demo_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('cover')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['is_published', 'position']);
        });

        Schema::create('skill_categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 60)->unique();
            $table->string('name', 80);
            $table->string('summary', 255)->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('skill_category_id')->constrained()->cascadeOnDelete();
            $table->string('name', 120);
            $table->string('level', 30); // projet | pratique | approfondissement | connaissances
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->unique(['skill_category_id', 'name']);
        });

        Schema::create('timeline_entries', function (Blueprint $table) {
            $table->id();
            $table->string('kind', 20); // formation | projet | experience
            $table->string('period', 60)->nullable();
            $table->string('title', 160);
            $table->string('place', 160)->nullable();
            $table->text('detail')->nullable();
            $table->string('project_slug', 80)->nullable();
            $table->boolean('is_extra')->default(false); // entrées sans date, affichées à part
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        // Contenus "simples" (profil, niveaux, ERP...) stockés en JSON par clé
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 60)->unique();
            $table->json('value')->nullable();
            $table->timestamps();
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('email', 190);
            $table->string('company', 120)->nullable();
            $table->text('message');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('timeline_entries');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('skill_categories');
        Schema::dropIfExists('projects');
    }
};
