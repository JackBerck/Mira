<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ForumComment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'forum_id',
        'user_id',
        'content',
    ];

    public function forum()
    {
        return $this->belongsTo(Forum::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
