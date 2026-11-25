<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use Database\Seeders\PortfolioSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PortfolioSeeder::class);
    }

    public function test_le_contenu_complet_est_servi_au_format_attendu(): void
    {
        $this->getJson('/api/portfolio')
            ->assertOk()
            ->assertJsonStructure([
                'profile' => ['name', 'role', 'contact' => ['email']],
                'levels',
                'skillCategories' => [['slug', 'name', 'skills' => [['name', 'level']]]],
                'projects' => [['slug', 'name', 'status', 'features', 'links' => ['demo', 'github']]],
                'timeline',
                'timelineExtra',
            ])
            ->assertJsonPath('projects.0.slug', 'eventia');
    }

    public function test_un_projet_par_slug_et_404_si_inconnu(): void
    {
        $this->getJson('/api/projects/eventia')->assertOk()->assertJsonPath('data.name', 'Eventia');
        $this->getJson('/api/projects/nexiste-pas')->assertNotFound();
    }

    public function test_competences_et_parcours(): void
    {
        $this->getJson('/api/skills')->assertOk()->assertJsonPath('data.0.slug', 'backend');
        $this->getJson('/api/timeline')->assertOk()->assertJsonStructure(['data', 'extra']);
    }

    public function test_un_message_valide_est_enregistre(): void
    {
        $this->postJson('/api/contact', [
            'name' => 'Recruteuse Test',
            'email' => 'rh@exemple.com',
            'company' => 'Entreprise',
            'message' => 'Bonjour, nous avons un stage à vous proposer.',
        ])->assertCreated();

        $this->assertDatabaseHas('contact_messages', ['email' => 'rh@exemple.com', 'company' => 'Entreprise']);
    }

    public function test_un_message_invalide_renvoie_des_erreurs_en_francais(): void
    {
        $this->postJson('/api/contact', ['name' => '', 'email' => 'pas-un-email', 'message' => 'court'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'message'])
            ->assertJsonPath('errors.email.0', 'Indiquez une adresse email valide, par exemple nom@entreprise.com.');
    }

    public function test_le_champ_piege_bloque_les_robots_sans_enregistrer(): void
    {
        $this->postJson('/api/contact', [
            'name' => 'Robot',
            'email' => 'robot@spam.com',
            'message' => 'Achetez nos produits maintenant !!!',
            'website' => 'http://spam.example',
        ])->assertCreated();

        $this->assertSame(0, ContactMessage::count());
    }

    public function test_la_limite_d_envois_est_appliquee(): void
    {
        $payload = ['name' => 'Test', 'email' => 'a@exemple.com', 'message' => 'Message de test assez long.'];

        for ($i = 0; $i < 3; $i++) {
            $this->postJson('/api/contact', $payload)->assertCreated();
        }
        $this->postJson('/api/contact', $payload)->assertStatus(429);
    }

    public function test_le_seeder_est_relancable(): void
    {
        $this->seed(PortfolioSeeder::class);
        $this->getJson('/api/projects')->assertOk()->assertJsonCount(4, 'data');
    }
}
