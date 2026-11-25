<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    protected function casts(): array
    {
        return ['value' => 'array'];
    }

    /** Lit une valeur JSON par sa clé (ex. Setting::fetch('profile')). */
    public static function fetch(string $key, mixed $default = null): mixed
    {
        return static::query()->firstWhere('key', $key)?->value ?? $default;
    }
}
