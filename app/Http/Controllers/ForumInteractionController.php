<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Forum;
use App\Models\ForumLike;
use App\Models\ForumComment;
use App\Notifications\ForumLikedNotification;
use App\Notifications\ForumCommentedNotification;
use Illuminate\Support\Facades\Auth;

class ForumInteractionController extends Controller
{
    public function toggleLike(Forum $forum)
    {
        $like = $forum->likes()->where('user_id', Auth::id())->first();

        if ($like) {
            $like->delete();
            $liked = false;

            // Delete related notification when unliked to prevent spam
            if ($forum->user_id !== Auth::id()) {
                $forum->user->notifications()
                    ->where('type', 'App\Notifications\ForumLikedNotification')
                    ->whereJsonContains('data->forum_id', $forum->id)
                    ->whereJsonContains('data->liker_id', Auth::id())
                    ->delete();
            }
        } else {
            $forum->likes()->create(['user_id' => Auth::id()]);
            $liked = true;

            // Send notification to forum owner (only if not liking own forum)
            if ($forum->user_id !== Auth::id()) {
                // Check if there's already an unread notification from this user for this forum
                $existingNotification = $forum->user->unreadNotifications()
                    ->where('type', 'App\Notifications\ForumLikedNotification')
                    ->whereJsonContains('data->forum_id', $forum->id)
                    ->whereJsonContains('data->liker_id', Auth::id())
                    ->first();

                // Only send notification if there isn't an existing unread one (prevent spam)
                if (!$existingNotification) {
                    $forum->user->notify(new ForumLikedNotification($forum, Auth::user()));
                }
            }
        }

        return back()->with('status', [
            'liked' => $liked,
            'message' => $liked ? 'Forum disukai.' : 'Suka dihapus.'
        ]);
    }

    public function storeComment(Request $request, Forum $forum)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        // Check for duplicate comments within last 1 minute (anti-spam)
        $recentComment = $forum->comments()
            ->where('user_id', Auth::id())
            ->where('content', $validated['content'])
            ->where('created_at', '>=', now()->subMinute())
            ->exists();

        if ($recentComment) {
            return back()->with('error', 'Anda baru saja mengirim komentar yang sama. Tunggu sebentar.');
        }

        $comment = $forum->comments()->create([
            'user_id' => Auth::id(),
            'content' => $validated['content'],
        ]);

        // Send notification to forum owner (only if not commenting on own forum)
        if ($forum->user_id !== Auth::id()) {
            $recentNotification = $forum->user->unreadNotifications()
                ->where('type', 'App\Notifications\ForumCommentedNotification')
                ->whereJsonContains('data->forum_id', $forum->id)
                ->whereJsonContains('data->commenter_id', Auth::id())
                ->where('created_at', '>=', now()->subMinutes(5))
                ->exists();

            if (!$recentNotification) {
                $forum->user->notify(new \App\Notifications\ForumCommentedNotification($forum, $comment, Auth::user()));
            }
        }

        return back()->with('success', 'Komentar berhasil ditambahkan.');
    }

    public function deleteComment(Forum $forum, ForumComment $comment)
    {
        // Only the comment owner or forum owner can delete the comment
        if (Auth::id() !== $comment->user_id && Auth::id() !== $forum->user_id) {
            return back()->with('error', 'Anda tidak memiliki izin untuk menghapus komentar ini.');
        }

        $comment->delete();
        return back()->with('success', 'Komentar berhasil dihapus.');
    }

    public function updateComment(Request $request, Forum $forum, ForumComment $comment)
    {
        // Only the comment owner can update the comment
        if (Auth::id() !== $comment->user_id) {
            return back()->with('error', 'Anda tidak memiliki izin untuk mengedit komentar ini.');
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment->update([
            'content' => $validated['content'],
        ]);

        return back()->with('success', 'Komentar berhasil diperbarui.');
    }
}
