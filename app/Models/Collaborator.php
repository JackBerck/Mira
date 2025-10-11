<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Collaborator extends Model
{
    protected $fillable = [
        'role',
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
