<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim((string) $this->input('name')),
            'email' => trim((string) $this->input('email')),
            'company' => trim((string) $this->input('company')) ?: null,
            'message' => trim((string) $this->input('message')),
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:190'],
            'company' => ['nullable', 'string', 'max:120'],
            'message' => ['required', 'string', 'min:10', 'max:3000'],
            'website' => ['nullable', 'string', 'max:255'], // champ piège anti-robots
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Indiquez votre nom.',
            'name.min' => 'Indiquez votre nom.',
            'name.max' => 'Le nom ne doit pas dépasser 120 caractères.',
            'email.required' => 'Indiquez votre adresse email.',
            'email.email' => 'Indiquez une adresse email valide, par exemple nom@entreprise.com.',
            'email.max' => 'L’adresse email est trop longue.',
            'company.max' => 'Le nom de l’entreprise ne doit pas dépasser 120 caractères.',
            'message.required' => 'Écrivez votre message.',
            'message.min' => 'Votre message doit contenir au moins 10 caractères.',
            'message.max' => 'Votre message dépasse 3 000 caractères.',
        ];
    }

    public function isSpam(): bool
    {
        return filled($this->input('website'));
    }
}
