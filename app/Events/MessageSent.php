<?php

namespace App\Events;

use App\Models\CollaborationChat;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $collaborationChat;

    /**
     * Create a new event instance.
     */
    public function __construct(CollaborationChat $collaborationChat)
    {
        $this->collaborationChat = $collaborationChat;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('collaboration.' . $this->collaborationChat->collaboration_id),
        ];
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->collaborationChat->id,
            'message' => $this->collaborationChat->message,
            'collaboration_id' => $this->collaborationChat->collaboration_id,
            'user' => [
                'id' => $this->collaborationChat->user->id,
                'name' => $this->collaborationChat->user->name,
                'email' => $this->collaborationChat->user->email,
            ],
            'created_at' => $this->collaborationChat->created_at->toISOString(),
        ];
    }
}
