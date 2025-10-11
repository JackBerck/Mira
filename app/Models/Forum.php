<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Forum extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'tags',
        'image',
        'forum_category_id',
        'user_id',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(ForumCategory::class, 'forum_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(ForumLike::class);
    }

    public function comments()
    {
        return $this->hasMany(ForumComment::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($forum) {
            if (empty($forum->slug)) {
                $baseSlug = Str::slug($forum->title);
                $slug = $baseSlug;
                $count = 1;

                // Pastikan slug unik
                while (self::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $count++;
                }

                $forum->slug = $slug;
            }
        });
    }
}
