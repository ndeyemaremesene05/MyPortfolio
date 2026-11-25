<?php

namespace App\Console\Commands;

use App\Models\ContactMessage;
use Illuminate\Console\Command;

/**
 * Lire les messages reçus par le formulaire :
 *   php artisan contact:messages            (tous)
 *   php artisan contact:messages --unread   (non lus)
 *   php artisan contact:messages --unread --mark-read
 */
class ContactMessages extends Command
{
    protected $signature = 'contact:messages {--unread : Seulement les messages non lus} {--mark-read : Marquer les messages affichés comme lus}';

    protected $description = 'Affiche les messages reçus par le formulaire de contact';

    public function handle(): int
    {
        $query = ContactMessage::query()->latest();
        if ($this->option('unread')) {
            $query->unread();
        }

        $messages = $query->limit(50)->get();

        if ($messages->isEmpty()) {
            $this->info('Aucun message.');

            return self::SUCCESS;
        }

        foreach ($messages as $message) {
            $this->line(str_repeat('-', 60));
            $this->line("<info>#{$message->id}</info>  {$message->created_at->format('d/m/Y H:i')}  ".($message->read_at ? 'lu' : '<comment>non lu</comment>'));
            $this->line("{$message->name} <{$message->email}>".($message->company ? " ({$message->company})" : ''));
            $this->newLine();
            $this->line($message->message);
        }
        $this->line(str_repeat('-', 60));

        if ($this->option('mark-read')) {
            ContactMessage::query()->whereIn('id', $messages->pluck('id'))->whereNull('read_at')->update(['read_at' => now()]);
            $this->info('Messages marqués comme lus.');
        }

        return self::SUCCESS;
    }
}
