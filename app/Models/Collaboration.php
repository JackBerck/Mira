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

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        // If image already starts with /storage/, return as is
        if (str_starts_with($this->image, '/storage/')) {
            return $this->image;
        }

        // Otherwise, prepend /storage/
        return '/storage/' . $this->image;
    }

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

    public function joinRequests()
    {
        return $this->hasMany(CollaborationJoinRequest::class);
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
