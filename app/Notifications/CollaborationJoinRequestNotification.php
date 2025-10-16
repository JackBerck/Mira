<?php

namespace App\Notifications;

use App\Models\Collaboration;
use App\Models\CollaborationJoinRequest;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CollaborationJoinRequestNotification extends Notification
{
    use Queueable;

    public function __construct(
        public CollaborationJoinRequest $joinRequest,
        public Collaboration $collaboration,
        public User $requester
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'collaboration_join_request',
            'join_request_id' => $this->joinRequest->id,
            'collaboration_id' => $this->collaboration->id,
            'collaboration_title' => $this->collaboration->title,
            'collaboration_slug' => $this->collaboration->slug,
            'requester_id' => $this->requester->id,
            'requester_name' => $this->requester->name,
            'requester_avatar' => $this->requester->avatar,
            'message' => "{$this->requester->name} ingin bergabung ke kolaborasi: {$this->collaboration->title}",
        ];
    }
}
