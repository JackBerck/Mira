<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CollaborationChat extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'message',
        'collaboration_id',
        'user_id',
    ];

    public function collaboration()
    {
        return $this->belongsTo(Collaboration::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
