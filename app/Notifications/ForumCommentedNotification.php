<?php

namespace App\Notifications;

use App\Models\Forum;
use App\Models\ForumComment;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ForumCommentedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Forum $forum,
        public ForumComment $comment,
        public User $commenter
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'forum_commented',
            'forum_id' => $this->forum->id,
            'forum_title' => $this->forum->title,
            'forum_slug' => $this->forum->slug,
            'comment_id' => $this->comment->id,
            'comment_content' => $this->comment->content,
            'commenter_id' => $this->commenter->id,
            'commenter_name' => $this->commenter->name,
            'commenter_avatar' => $this->commenter->avatar,
            'message' => "{$this->commenter->name} mengomentari forum Anda: {$this->forum->title}",
        ];
    }
}
