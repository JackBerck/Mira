<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ForumCategory extends Model
{
    protected $fillable = ['name', 'slug'];

    public function forums(): HasMany
    {
        return $this->hasMany(Forum::class, 'forum_category_id');
    }

    public function collaborations(): HasMany
    {
        return $this->hasMany(Collaboration::class, 'forum_category_id');
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $baseSlug = Str::slug($category->name);
                $slug = $baseSlug;
                $count = 1;

                // Pastikan slug unik
                while (self::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $count++;
                }

                $category->slug = $slug;
            }
        });
    }
}
