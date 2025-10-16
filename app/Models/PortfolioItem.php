<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortfolioItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'url',
        'image',
        'tags',
        'type',
        'date',
    ];

    protected $casts = [
        'tags' => 'array',
        'date' => 'date',
    ];

    /**
     * Get the user that owns the portfolio item.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
