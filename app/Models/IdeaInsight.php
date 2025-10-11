<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IdeaInsight extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'message',
        'is_ai_generated',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
