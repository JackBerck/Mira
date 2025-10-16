<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'bio',
        'skills',
        'interests',
        'portfolio_url',
        'image',
    ];

    protected $casts = [
        'skills' => 'array',
        'interests' => 'array',
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    public function forums(): HasMany
    {
        return $this->hasMany(Forum::class);
    }

    public function forumLikes(): HasMany
    {
        return $this->hasMany(ForumLike::class);
    }

    public function forumComments(): HasMany
    {
        return $this->hasMany(ForumComment::class);
    }

    public function collaborations(): HasMany
    {
        return $this->hasMany(Collaboration::class);
    }

    public function collaborators(): HasMany
    {
        return $this->hasMany(Collaborator::class);
    }

    public function collaborationChats(): HasMany
    {
        return $this->hasMany(CollaborationChat::class);
    }

    public function ideaInsights(): HasMany
    {
        return $this->hasMany(IdeaInsight::class);
    }

    public function portfolioItems(): HasMany
    {
        return $this->hasMany(PortfolioItem::class);
    }
}
