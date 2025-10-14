<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Forum;
use App\Models\ForumLike;
use App\Models\ForumComment;
use Illuminate\Support\Facades\Auth;

class ForumInteractionController extends Controller
{
    public function toggleLike(Forum $forum)
    {
        $like = $forum->likes()->where('user_id', Auth::id())->first();

        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            $forum->likes()->create(['user_id' => Auth::id()]);
            $liked = true;
        }

        return back()->with('status', [
            'liked' => $liked,
            'message' => $liked ? 'Forum disukai.' : 'Suka dihapus.'
        ]);
    }

    public function storeComment(Request $request, Forum $forum)
    {
        $validated =$request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $forum->comments()->create([
            'user_id' => Auth::id(),
            'content' => $validated['content'],
        ]);

        return back()->with('status', 'Komentar berhasil ditambahkan.');
    }
}
