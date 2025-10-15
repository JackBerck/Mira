<?php

namespace App\Http\Controllers;

use App\Models\Forum;
use App\Models\ForumCategory;
use App\Models\Collaboration;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        // Get sidebar data
        $sidebarData = $this->getForumSidebarData();

        return Inertia::render("dashboard", [
            'forums' => $forums,
            'sidebar' => $sidebarData,
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
                'user' => $collab->user ? [
                    'id' => $collab->user->id,
                    'name' => $collab->user->name,
                ] : null,
            ];
        });

        // Get sidebar data
        $sidebarData = $this->getCollaborationSidebarData();

        return Inertia::render("dashboard-collaborations", [
            'collaborations' => $collaborations,
            'sidebar' => $sidebarData,
        ]);
    }

    // Helper: Get Forum Sidebar Data
    private function getForumSidebarData()
    {
        // Popular tags from forums
        $allTags = Forum::whereNotNull('tags')
            ->get()
            ->pluck('tags')
            ->map(function ($tags) {
                // Decode JSON if string, ensure array
                if (is_string($tags)) {
                    $decoded = json_decode($tags, true);
                    return is_array($decoded) ? $decoded : [];
                }
                return is_array($tags) ? $tags : [];
            })
            ->flatten()
            ->filter(function ($tag) {
                return !empty($tag) && is_string($tag);
            })
            ->countBy()
            ->sortDesc()
            ->take(6)
            ->keys()
            ->toArray();

        // Trending topics (most discussed forums in last 30 days)
        $trendingTopics = Forum::with('category')
            ->withCount(['likes', 'comments'])
            ->where('created_at', '>=', now()->subDays(30))
            ->orderByRaw('(likes_count + comments_count) DESC')
            ->take(3)
            ->get()
            ->map(function ($forum) {
                return [
                    'title' => $forum->title,
                    'slug' => $forum->slug,
                    'count' => $forum->likes_count + $forum->comments_count,
                ];
            });

        // Stats
        $stats = [
            'totalForums' => Forum::count(),
            'totalCollaborations' => Collaboration::count(),
            'totalMembers' => User::count(),
        ];

        return [
            'popularTags' => $allTags,
            'trendingTopics' => $trendingTopics,
            'stats' => $stats,
        ];
    }

    // Helper: Get Collaboration Sidebar Data
    private function getCollaborationSidebarData()
    {
        // Popular categories
        $popularCategories = ForumCategory::withCount('collaborations')
            ->having('collaborations_count', '>', 0)
            ->orderBy('collaborations_count', 'desc')
            ->take(4)
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'count' => $category->collaborations_count,
                ];
            });

        // Status counts
        $statusCounts = [
            'open' => Collaboration::where('status', 'open')->count(),
            'in_progress' => Collaboration::where('status', 'in-progress')->count(),
            'completed' => Collaboration::where('status', 'completed')->count(),
        ];

        // Stats
        $stats = [
            'totalCollaborations' => Collaboration::count(),
            'activeMembers' => DB::table('collaborators')->distinct('user_id')->count('user_id'),
            'thisMonth' => Collaboration::where('created_at', '>=', now()->startOfMonth())->count(),
        ];

        return [
            'popularCategories' => $popularCategories,
            'statusCounts' => $statusCounts,
            'stats' => $stats,
        ];
    }
}
