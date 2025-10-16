<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Collaboration;
use App\Models\CollaborationChat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Get all collaborations where user is owner or collaborator
        $collaborations = Collaboration::where('user_id', $user->id)
            ->orWhereHas('collaborators', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['user', 'collaborators.user'])
            ->latest()
            ->get();

        return Inertia::render("chat/page", [
            'collaborations' => $collaborations,
        ]);
    }

    public function getMessages($collaborationId)
    {
        $collaboration = Collaboration::findOrFail($collaborationId);
        
        // Verify user has access to this collaboration
        $user = auth()->user();
        if ($collaboration->user_id !== $user->id && 
            !$collaboration->collaborators()->where('user_id', $user->id)->exists()) {
            abort(403, 'Unauthorized');
        }

        $messages = CollaborationChat::where('collaboration_id', $collaborationId)
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'messages' => $messages,
            'collaboration' => $collaboration->load(['user', 'collaborators.user']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:5000',
            'collaboration_id' => 'required|exists:collaborations,id',
        ]);

        $collaboration = Collaboration::findOrFail($request->collaboration_id);
        
        // Verify user has access to this collaboration
        $user = auth()->user();
        if ($collaboration->user_id !== $user->id && 
            !$collaboration->collaborators()->where('user_id', $user->id)->exists()) {
            abort(403, 'Unauthorized');
        }

        $chat = CollaborationChat::create([
            'message' => $request->message,
            'collaboration_id' => $request->collaboration_id,
            'user_id' => $user->id,
        ]);

        $chat->load('user');

        // Broadcast the message
        broadcast(new MessageSent($chat))->toOthers();

        return response()->json([
            'chat' => $chat,
        ], 201);
    }

    public function getUnreadCount($collaborationId)
    {
        $collaboration = Collaboration::findOrFail($collaborationId);
        
        // Verify user has access to this collaboration
        $user = auth()->user();
        if ($collaboration->user_id !== $user->id && 
            !$collaboration->collaborators()->where('user_id', $user->id)->exists()) {
            return response()->json(['count' => 0]);
        }

        // For now, return 0 as we don't have read status tracking
        // This can be enhanced later with a read_receipts table
        return response()->json(['count' => 0]);
    }

    public function getTotalUnreadCount()
    {
        $user = auth()->user();
        
        // Get all collaborations where user is owner or collaborator
        $collaborations = Collaboration::where('user_id', $user->id)
            ->orWhereHas('collaborators', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->get();

        // Count pending join requests for collaborations owned by user
        $pendingRequestsCount = \App\Models\CollaborationJoinRequest::whereIn('collaboration_id', 
            Collaboration::where('user_id', $user->id)->pluck('id')
        )
        ->where('status', 'pending')
        ->count();

        // For now, total unread is just pending requests count
        // This can be enhanced later with actual message read tracking
        return response()->json(['count' => $pendingRequestsCount]);
    }
}
