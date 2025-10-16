<?php

namespace App\Http\Controllers;

use App\Models\DirectMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DirectMessageController extends Controller
{
    /**
     * Get all conversations (users that current user has chatted with)
     */
    public function getConversations()
    {
        $userId = auth()->id();
        
        // Get unique users that current user has chatted with
        $conversations = User::whereIn('id', function ($query) use ($userId) {
            $query->select('sender_id')
                ->from('direct_messages')
                ->where('receiver_id', $userId)
                ->union(
                    DB::table('direct_messages')
                        ->select('receiver_id')
                        ->where('sender_id', $userId)
                );
        })
        ->withCount(['receivedMessages as unread_count' => function ($query) use ($userId) {
            $query->where('sender_id', '!=', $userId)
                  ->where('receiver_id', $userId)
                  ->where('is_read', false);
        }])
        ->get();

        // Get last message for each conversation
        $conversationsWithLastMessage = $conversations->map(function ($user) use ($userId) {
            $lastMessage = DirectMessage::where(function ($query) use ($userId, $user) {
                $query->where('sender_id', $userId)
                      ->where('receiver_id', $user->id);
            })->orWhere(function ($query) use ($userId, $user) {
                $query->where('sender_id', $user->id)
                      ->where('receiver_id', $userId);
            })
            ->latest()
            ->first();

            return [
                'user' => $user,
                'last_message' => $lastMessage,
                'unread_count' => $user->unread_count ?? 0,
            ];
        });

        return response()->json($conversationsWithLastMessage);
    }

    /**
     * Get messages between current user and another user
     */
    public function getMessages($userId)
    {
        $currentUserId = auth()->id();
        
        $messages = DirectMessage::where(function ($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $currentUserId)
                  ->where('receiver_id', $userId);
        })->orWhere(function ($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $currentUserId);
        })
        ->with(['sender', 'receiver'])
        ->orderBy('created_at', 'asc')
        ->get();

        // Mark messages as read
        DirectMessage::where('sender_id', $userId)
            ->where('receiver_id', $currentUserId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $otherUser = User::findOrFail($userId);

        return response()->json([
            'messages' => $messages,
            'user' => $otherUser,
        ]);
    }

    /**
     * Send a message
     */
    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:5000',
        ]);

        // Prevent user from sending message to themselves
        if ($request->receiver_id == auth()->id()) {
            return response()->json([
                'error' => 'Anda tidak dapat mengirim pesan kepada diri sendiri.',
            ], 400);
        }

        $message = DirectMessage::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        $message->load(['sender', 'receiver']);

        return response()->json([
            'message' => $message,
        ], 201);
    }
}
