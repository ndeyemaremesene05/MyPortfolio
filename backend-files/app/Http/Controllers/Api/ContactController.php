<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class ContactController extends Controller
{
    /** POST /api/contact */
    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        // Robot détecté (champ piège rempli) : on répond comme si tout allait bien, sans rien enregistrer.
        if ($request->isSpam()) {
            return response()->json(['message' => 'Message envoyé.'], 201);
        }

        $message = ContactMessage::create([
            ...$request->safe()->only(['name', 'email', 'company', 'message']),
            'ip_address' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 250, ''),
        ]);

        $this->notify($message);

        return response()->json(['message' => 'Message envoyé.'], 201);
    }

    /** Copie par email, si CONTACT_NOTIFY_EMAIL est défini. Un échec d'envoi ne bloque pas le visiteur. */
    private function notify(ContactMessage $message): void
    {
        $to = config('portfolio.contact_notify_email');
        if (! $to) {
            return;
        }

        try {
            Mail::raw(
                "Nouveau message depuis le portfolio\n\n"
                ."Nom : {$message->name}\n"
                ."Email : {$message->email}\n"
                .'Entreprise : '.($message->company ?? '-')."\n\n"
                .$message->message,
                function ($mail) use ($to, $message) {
                    $mail->to($to)
                        ->replyTo($message->email, $message->name)
                        ->subject('Portfolio : message de '.$message->name);
                }
            );
        } catch (Throwable $e) {
            Log::warning('Email de notification non envoyé : '.$e->getMessage(), ['contact_message_id' => $message->id]);
        }
    }
}
