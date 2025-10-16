<?php

namespace App\Notifications;

use App\Models\Forum;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ForumLikedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Forum $forum,
        public User $liker
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'forum_liked',
            'forum_id' => $this->forum->id,
            'forum_title' => $this->forum->title,
            'forum_slug' => $this->forum->slug,
            'liker_id' => $this->liker->id,
            'liker_name' => $this->liker->name,
            'liker_avatar' => $this->liker->avatar,
            'message' => "{$this->liker->name} menyukai forum Anda: {$this->forum->title}",
        ];
    }
}
