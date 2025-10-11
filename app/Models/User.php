<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
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
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factory_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function forums()
    {
        return $this->hasMany(Forum::class);
    }

    public function forumLikes()
    {
        return $this->hasMany(ForumLike::class);
    }

    public function forumComments()
    {
        return $this->hasMany(ForumComment::class);
    }

    public function collaborations()
    {
        return $this->hasMany(Collaboration::class);
    }

    public function collaborators()
    {
        return $this->hasMany(Collaborator::class);
    }

    public function collaborationChats()
    {
        return $this->hasMany(CollaborationChat::class);
    }

    public function ideaInsights()
    {
        return $this->hasMany(IdeaInsight::class);
    }
}
