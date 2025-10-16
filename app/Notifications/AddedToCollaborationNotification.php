<?php

namespace App\Notifications;

use App\Models\Collaboration;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AddedToCollaborationNotification extends Notification
{
    use Queueable;

    protected Collaboration $collaboration;
    protected User $addedBy;
    protected string $role;

    /**
     * Create a new notification instance.
     */
    public function __construct(Collaboration $collaboration, User $addedBy, string $role)
    {
        $this->collaboration = $collaboration;
        $this->addedBy = $addedBy;
        $this->role = $role;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'added_to_collaboration',
            'collaboration_id' => $this->collaboration->id,
            'collaboration_title' => $this->collaboration->title,
            'collaboration_slug' => $this->collaboration->slug,
            'added_by_id' => $this->addedBy->id,
            'added_by_name' => $this->addedBy->name,
            'added_by_avatar' => $this->addedBy->avatar,
            'role' => $this->role,
            'message' => "{$this->addedBy->name} menambahkan Anda sebagai {$this->role} dalam kolaborasi \"{$this->collaboration->title}\"",
        ];
    }
}
