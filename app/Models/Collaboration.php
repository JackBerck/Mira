<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Collaboration extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'skills_needed',
        'status',
        'image',
        'forum_category_id',
        'user_id',
    ];

    protected $casts = [
        'skills_needed' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(ForumCategory::class,'forum_category_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function collaborators()
    {
        return $this->hasMany(Collaborator::class);
    }

    public function chats()
    {
        return $this->hasMany(CollaborationChat::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($collaboration) {
            if (empty($collaboration->slug)) {
                $baseSlug = Str::slug($collaboration->title);
                $slug = $baseSlug;
                $count = 1;

                // Pastikan slug unik
                while (self::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $count++;
                }

                $collaboration->slug = $slug;
            }
        });
    }
}
