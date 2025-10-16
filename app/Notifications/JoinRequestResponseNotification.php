<?php

namespace App\Notifications;

use App\Models\Collaboration;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class JoinRequestResponseNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Collaboration $collaboration,
        public string $status, // 'accepted' or 'rejected'
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $message = $this->status === 'accepted'
            ? "Permintaan Anda untuk bergabung ke kolaborasi '{$this->collaboration->title}' telah diterima!"
            : "Permintaan Anda untuk bergabung ke kolaborasi '{$this->collaboration->title}' ditolak.";

        return [
            'type' => 'join_request_response',
            'collaboration_id' => $this->collaboration->id,
            'collaboration_title' => $this->collaboration->title,
            'collaboration_slug' => $this->collaboration->slug,
            'status' => $this->status,
            'message' => $message,
        ];
    }
}
