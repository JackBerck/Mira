<?php

namespace App\Http\Controllers;

use App\Models\Forum;
use App\Models\Collaboration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    // Dashboard - Forum List
    public function index(Request $request)
    {
        $page = $request->get('page', 1);

        // Get forums with relationships and counts
        $forums = Forum::with(['category', 'user'])
            ->withCount(['likes', 'comments'])
            ->orderBy('created_at', 'desc')
            ->paginate(10, ['*'], 'page', $page);

        // Transform forums data to match frontend type
        $forums->getCollection()->transform(function ($forum) {
            // Ensure tags is always an array
            $tags = $forum->tags;
            if (!is_array($tags)) {
                $tags = $tags ? (is_string($tags) ? json_decode($tags, true) ?? [] : []) : [];
            }

            return [
                'id' => $forum->id,
                'title' => $forum->title,
                'slug' => $forum->slug,
                'description' => $forum->description,
                'tags' => $tags,
                'image' => $forum->image ? asset('storage/' . $forum->image) : null,
                'category' => [
                    'id' => $forum->category->id,
                    'name' => $forum->category->name,
                    'slug' => $forum->category->slug,
                ],
                'user' => [
                    'id' => $forum->user->id,
                    'name' => $forum->user->name,
                    'avatar' => $forum->user->avatar ? asset('storage/' . $forum->user->avatar) : null,
                ],
                'likes_count' => $forum->likes_count,
                'comments_count' => $forum->comments_count,
                'created_at' => $forum->created_at->toISOString(),
            ];
        });

        return Inertia::render("dashboard", [
            'forums' => $forums,
        ]);
    }

    // Collaboration List (separate page for authenticated users)
    public function collaborations(Request $request)
    {
        $page = $request->get('page', 1);

        // Get collaborations with relationships
        $collaborations = Collaboration::with(['category', 'user', 'collaborators'])
            ->orderBy('created_at', 'desc')
            ->paginate(10, ['*'], 'page', $page);

        // Transform collaborations data to match frontend type
        $collaborations->getCollection()->transform(function ($collab) {
            // Ensure skills_needed is always an array
            $skills = $collab->skills_needed;
            if (!is_array($skills)) {
                $skills = $skills ? (is_string($skills) ? json_decode($skills, true) ?? [] : []) : [];
            }

            return [
                'id' => (string) $collab->id,
                'title' => $collab->title,
                'slug' => $collab->slug,
                'description' => $collab->description,
                'category' => $collab->category->name ?? 'Teknologi',
                'status' => $collab->status,
                'membersCount' => $collab->collaborators->count(),
                'skillsNeeded' => $skills,
                'forumId' => null,
                'coverUrl' => $collab->image ? asset('storage/' . $collab->image) : null,
                'createdAt' => $collab->created_at->toISOString(),
                'updatedAt' => $collab->updated_at->toISOString(),
            ];
        });

        return Inertia::render("dashboard-collaborations", [
            'collaborations' => $collaborations,
        ]);
    }
}
