<?php

namespace App\Http\Controllers;

use App\Models\Collaboration;
use App\Models\CollaborationJoinRequest;
use App\Models\Collaborator;
use App\Notifications\CollaborationJoinRequestNotification;
use App\Notifications\JoinRequestResponseNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CollaborationJoinRequestController extends Controller
{
    public function store(Request $request, Collaboration $collaboration)
    {
        $request->validate([
            'message' => 'nullable|string|max:500',
        ]);

        // Check if user is already a collaborator
        $isCollaborator = Collaborator::where('collaboration_id', $collaboration->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if ($isCollaborator) {
            return back()->with('error', 'Anda sudah menjadi anggota kolaborasi ini.');
        }

        // Check if user is the owner
        if ($collaboration->user_id === $request->user()->id) {
            return back()->with('error', 'Anda adalah pembuat kolaborasi ini.');
        }

        // Create or update join request
        $joinRequest = CollaborationJoinRequest::updateOrCreate(
            [
                'collaboration_id' => $collaboration->id,
                'user_id' => $request->user()->id,
            ],
            [
                'message' => $request->message,
                'status' => 'pending',
            ]
        );

        // Send notification to collaboration owner
        $collaboration->user->notify(
            new CollaborationJoinRequestNotification(
                $joinRequest,
                $collaboration,
                $request->user()
            )
        );

        return back()->with('success', 'Permintaan bergabung telah dikirim!');
    }

    public function accept(Request $request, CollaborationJoinRequest $joinRequest)
    {
        $collaboration = $joinRequest->collaboration;

        // Check if current user is the collaboration owner
        if ($collaboration->user_id !== $request->user()->id) {
            return back()->with('error', 'Anda tidak memiliki akses untuk menerima permintaan ini.');
        }

        // Check if request is still pending
        if ($joinRequest->status !== 'pending') {
            return back()->with('error', 'Permintaan ini sudah diproses.');
        }

        DB::transaction(function () use ($joinRequest, $collaboration) {
            // Update join request status
            $joinRequest->update(['status' => 'accepted']);

            // Add user as collaborator
            Collaborator::create([
                'collaboration_id' => $collaboration->id,
                'user_id' => $joinRequest->user_id,
                'role' => 'Anggota',
            ]);

            // Send notification to requester
            $joinRequest->user->notify(
                new JoinRequestResponseNotification($collaboration, 'accepted')
            );
        });

        return back()->with('success', 'Permintaan bergabung telah diterima!');
    }

    public function reject(Request $request, CollaborationJoinRequest $joinRequest)
    {
        $collaboration = $joinRequest->collaboration;

        // Check if current user is the collaboration owner
        if ($collaboration->user_id !== $request->user()->id) {
            return back()->with('error', 'Anda tidak memiliki akses untuk menolak permintaan ini.');
        }

        // Check if request is still pending
        if ($joinRequest->status !== 'pending') {
            return back()->with('error', 'Permintaan ini sudah diproses.');
        }

        // Update join request status
        $joinRequest->update(['status' => 'rejected']);

        // Send notification to requester
        $joinRequest->user->notify(
            new JoinRequestResponseNotification($collaboration, 'rejected')
        );

        return back()->with('success', 'Permintaan bergabung telah ditolak.');
    }

    public function getPendingRequests(Request $request, $collaborationId)
    {
        $collaboration = Collaboration::findOrFail($collaborationId);

        // Verify user has access to this collaboration (owner or member)
        $user = $request->user();
        $hasAccess = $collaboration->user_id === $user->id || 
                     $collaboration->collaborators()->where('user_id', $user->id)->exists();
        
        if (!$hasAccess) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Only owner can see and manage requests, but all members can see the count
        $isOwner = $collaboration->user_id === $user->id;
        
        if (!$isOwner) {
            // For non-owners, just return empty array (they can't see details)
            return response()->json(['requests' => []]);
        }

        $requests = CollaborationJoinRequest::with('user')
            ->where('collaboration_id', $collaborationId)
            ->where('status', 'pending')
            ->latest()
            ->get();

        return response()->json(['requests' => $requests]);
    }
}
