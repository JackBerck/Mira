<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Collaboration;
use App\Models\Forum;
use App\Models\ForumCategory;
use App\Models\PortfolioItem;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('profile/index', [
            'user' => $request->user(),
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Show skills and interests page.
     */
    public function skillsInterests(Request $request): Response
    {
        return Inertia::render('profile/skills-interests', [
            'user' => $request->user(),
            'status' => session('status'),
        ]);
    }

    /**
     * Show portfolio page.
     */
    public function portfolio(Request $request): Response
    {
        $portfolioItems = $request->user()
            ->portfolioItems()
            ->orderBy('date', 'desc')
            ->get();

        return Inertia::render('profile/portfolio', [
            'portfolioItems' => $portfolioItems,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }

            $validated['image'] = $request->file('image')->store('profile-images', 'public');
        }

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return back()->with('status', 'profile-updated');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $request->user()->update([
            'password' => bcrypt($request->password),
        ]);

        return back()->with('status', 'password-updated');
    }

    /**
     * Update skills and interests.
     */
    public function updateSkillsInterests(Request $request): RedirectResponse
    {
        $request->validate([
            'skills' => 'array',
            'skills.*' => 'string|max:50',
            'interests' => 'array',
            'interests.*' => 'string|max:50',
        ]);

        $request->user()->update([
            'skills' => $request->skills ?? [],
            'interests' => $request->interests ?? [],
        ]);

        return back()->with('status', 'skills-updated');
    }

    /**
     * Store a new portfolio item.
     */
    public function storePortfolio(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'url' => 'nullable|url',
            'image' => 'nullable|image|max:2048',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'type' => 'required|in:project,achievement,experience',
            'date' => 'required|date',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('portfolio-images', 'public');
        }

        $request->user()->portfolioItems()->create($validated);

        return back()->with('status', 'portfolio-updated');
    }

    /**
     * Update a portfolio item.
     */
    public function updatePortfolio(Request $request, PortfolioItem $portfolioItem): RedirectResponse
    {
        // Check authorization
        if ($portfolioItem->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'url' => 'nullable|url',
            'image' => 'nullable|image|max:2048',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'type' => 'required|in:project,achievement,experience',
            'date' => 'required|date',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($portfolioItem->image) {
                Storage::disk('public')->delete($portfolioItem->image);
            }

            $validated['image'] = $request->file('image')->store('portfolio-images', 'public');
        }

        $portfolioItem->update($validated);

        return back()->with('status', 'portfolio-updated');
    }

    /**
     * Delete a portfolio item.
     */
    public function destroyPortfolio(Request $request, PortfolioItem $portfolioItem): RedirectResponse
    {
        // Check authorization
        if ($portfolioItem->user_id !== $request->user()->id) {
            abort(403);
        }

        // Delete image if exists
        if ($portfolioItem->image) {
            Storage::disk('public')->delete($portfolioItem->image);
        }

        $portfolioItem->delete();

        return back()->with('status', 'portfolio-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Show user's forums page.
     */
    public function myForums(Request $request): Response
    {
        try {
            $forums = Forum::with(['category', 'user'])
                ->withCount(['likes', 'comments'])
                ->where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->paginate(10)
                ->through(function ($forum) {
                    return [
                        'id' => $forum->id,
                        'title' => $forum->title,
                        'slug' => $forum->slug,
                        'description' => $forum->description,
                        'tags' => $forum->tags ?? [],
                        'image' => $forum->image ? asset('storage/' . $forum->image) : null,
                        'category' => $forum->category ? [
                            'id' => $forum->category->id,
                            'name' => $forum->category->name,
                            'slug' => $forum->category->slug,
                        ] : ['id' => 0, 'name' => 'Tanpa Kategori', 'slug' => 'none'],
                        'user' => [
                            'id' => $forum->user->id,
                            'name' => $forum->user->name,
                        ],
                        'likes_count' => $forum->likes_count ?? 0,
                        'comments_count' => $forum->comments_count ?? 0,
                        'created_at' => $forum->created_at->toISOString(),
                        'updated_at' => $forum->updated_at->toISOString(),
                    ];
                });

            return Inertia::render('profile/forum', [
                'forums' => $forums,
            ]);
        } catch (\Exception $e) {
            return Inertia::render('profile/forum', [
                'forums' => [
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 10,
                    'total' => 0,
                ],
            ]);
        }
    }

    /**
     * Show user's collaborations page.
     */
    public function myCollaborations(Request $request): Response
    {
        try {
            $collaborations = Collaboration::with(['category', 'user'])
                ->withCount(['collaborators', 'chats'])
                ->where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->paginate(10)
                ->through(function ($collaboration) {
                    return [
                        'id' => $collaboration->id,
                        'title' => $collaboration->title,
                        'slug' => $collaboration->slug,
                        'description' => $collaboration->description,
                        'skills_needed' => $collaboration->skills_needed ?? [],
                        'status' => $collaboration->status,
                        'image' => $collaboration->image ? asset('storage/' . $collaboration->image) : null,
                        'category' => $collaboration->category ? [
                            'id' => $collaboration->category->id,
                            'name' => $collaboration->category->name,
                            'slug' => $collaboration->category->slug,
                        ] : ['id' => 0, 'name' => 'Tanpa Kategori', 'slug' => 'none'],
                        'user' => [
                            'id' => $collaboration->user->id,
                            'name' => $collaboration->user->name,
                        ],
                        'collaborators_count' => $collaboration->collaborators_count ?? 0,
                        'chats_count' => $collaboration->chats_count ?? 0,
                        'created_at' => $collaboration->created_at->toISOString(),
                        'updated_at' => $collaboration->updated_at->toISOString(),
                    ];
                });

            return Inertia::render('profile/collaboration', [
                'collaborations' => $collaborations,
            ]);
        } catch (\Exception $e) {
            return Inertia::render('profile/collaboration', [
                'collaborations' => [
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 10,
                    'total' => 0,
                ],
            ]);
        }
    }

    /**
     * Show user's liked forums page - Alternative approach.
     */
    public function likedForums(Request $request): Response
    {
        try {
            $userId = $request->user()->id;

            // Get forum IDs that user has liked
            $likedForumIds = DB::table('forum_likes')
                ->where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->pluck('forum_id', 'created_at')
                ->toArray();

            if (empty($likedForumIds)) {
                return Inertia::render('profile/liked-forum', [
                    'likedForums' => [
                        'data' => [],
                        'current_page' => 1,
                        'last_page' => 1,
                        'per_page' => 10,
                        'total' => 0,
                    ],
                ]);
            }

            $forums = Forum::with(['category', 'user'])
                ->whereIn('id', array_values($likedForumIds))
                ->get()
                ->map(function ($forum) use ($likedForumIds) {
                    // Get liked_at timestamp for this forum
                    $likedAt = array_search($forum->id, $likedForumIds);

                    return [
                        'id' => $forum->id,
                        'title' => $forum->title,
                        'slug' => $forum->slug,
                        'description' => $forum->description,
                        'tags' => $forum->tags ?? [],
                        'image' => $forum->image ? asset('storage/' . $forum->image) : null,
                        'category' => $forum->category ? [
                            'id' => $forum->category->id,
                            'name' => $forum->category->name,
                            'slug' => $forum->category->slug,
                        ] : ['id' => 0, 'name' => 'Tanpa Kategori', 'slug' => 'none'],
                        'user' => [
                            'id' => $forum->user->id,
                            'name' => $forum->user->name,
                        ],
                        'likes_count' => $forum->likes()->count(),
                        'comments_count' => $forum->comments()->count(),
                        'created_at' => $forum->created_at->toISOString(),
                        'liked_at' => $likedAt ? \Carbon\Carbon::parse($likedAt)->toISOString() : $forum->created_at->toISOString(),
                    ];
                })
                ->sortByDesc('liked_at')
                ->values();

            // Manual pagination
            $page = $request->get('page', 1);
            $perPage = 10;
            $total = $forums->count();
            $items = $forums->slice(($page - 1) * $perPage, $perPage);

            return Inertia::render('profile/liked-forum', [
                'likedForums' => [
                    'data' => $items,
                    'current_page' => $page,
                    'last_page' => ceil($total / $perPage),
                    'per_page' => $perPage,
                    'total' => $total,
                ],
            ]);
        } catch (\Exception $e) {
            return Inertia::render('profile/liked-forum', [
                'likedForums' => [
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 10,
                    'total' => 0,
                ],
            ]);
        }
    }

    /**
     * Show user's commented forums page - Alternative approach.
     */
    public function commentedForums(Request $request): Response
    {
        try {
            $userId = $request->user()->id;

            // Get forum IDs that user has commented on
            $commentedForumData = DB::table('forum_comments')
                ->where('user_id', $userId)
                ->select('forum_id', DB::raw('MAX(created_at) as last_commented_at'), DB::raw('COUNT(*) as user_comment_count'))
                ->groupBy('forum_id')
                ->orderBy('last_commented_at', 'desc')
                ->get()
                ->keyBy('forum_id');

            if ($commentedForumData->isEmpty()) {
                return Inertia::render('profile/commented-forum', [
                    'commentedForums' => [
                        'data' => [],
                        'current_page' => 1,
                        'last_page' => 1,
                        'per_page' => 10,
                        'total' => 0,
                    ],
                ]);
            }

            $forums = Forum::with(['category', 'user'])
                ->whereIn('id', $commentedForumData->keys())
                ->get()
                ->map(function ($forum) use ($commentedForumData) {
                    $commentData = $commentedForumData->get($forum->id);

                    return [
                        'id' => $forum->id,
                        'title' => $forum->title,
                        'slug' => $forum->slug,
                        'description' => $forum->description,
                        'tags' => $forum->tags ?? [],
                        'image' => $forum->image ? asset('storage/' . $forum->image) : null,
                        'category' => $forum->category ? [
                            'id' => $forum->category->id,
                            'name' => $forum->category->name,
                            'slug' => $forum->category->slug,
                        ] : ['id' => 0, 'name' => 'Tanpa Kategori', 'slug' => 'none'],
                        'user' => [
                            'id' => $forum->user->id,
                            'name' => $forum->user->name,
                        ],
                        'likes_count' => $forum->likes()->count(),
                        'comments_count' => $forum->comments()->count(),
                        'user_comments_count' => $commentData->user_comment_count ?? 0,
                        'created_at' => $forum->created_at->toISOString(),
                        'last_commented_at' => $commentData->last_commented_at ?
                            \Carbon\Carbon::parse($commentData->last_commented_at)->toISOString() :
                            $forum->created_at->toISOString(),
                    ];
                })
                ->sortByDesc('last_commented_at')
                ->values();

            // Manual pagination
            $page = $request->get('page', 1);
            $perPage = 10;
            $total = $forums->count();
            $items = $forums->slice(($page - 1) * $perPage, $perPage);

            return Inertia::render('profile/commented-forum', [
                'commentedForums' => [
                    'data' => $items,
                    'current_page' => $page,
                    'last_page' => ceil($total / $perPage),
                    'per_page' => $perPage,
                    'total' => $total,
                ],
                'userId' => $userId
            ]);
        } catch (\Exception $e) {
            return Inertia::render('profile/commented-forum', [
                'commentedForums' => [
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 10,
                    'total' => 0,
                ],
            ]);
        }
    }

    /**
     * Show user's followed collaborations page.
     */
    public function followedCollaborations(Request $request): Response
    {
        try {
            $userId = $request->user()->id;

            // Get collaboration data where user is a collaborator
            $collaboratorData = DB::table('collaborators')
                ->where('user_id', $userId)
                ->select('collaboration_id', 'role', 'created_at as joined_at')
                ->orderBy('created_at', 'desc')
                ->get()
                ->keyBy('collaboration_id');

            if ($collaboratorData->isEmpty()) {
                return Inertia::render('profile/followed-collaboration', [
                    'followedCollaborations' => [
                        'data' => [],
                        'current_page' => 1,
                        'last_page' => 1,
                        'per_page' => 10,
                        'total' => 0,
                    ],
                ]);
            }

            $collaborations = Collaboration::with(['category', 'user'])
                ->whereIn('id', $collaboratorData->keys())
                ->get()
                ->map(function ($collaboration) use ($collaboratorData) {
                    $collaboratorInfo = $collaboratorData->get($collaboration->id);

                    return [
                        'id' => $collaboration->id,
                        'title' => $collaboration->title,
                        'slug' => $collaboration->slug,
                        'description' => $collaboration->description,
                        'skills_needed' => $collaboration->skills_needed ?? [],
                        'status' => $collaboration->status,
                        'image' => $collaboration->image ? asset('storage/' . $collaboration->image) : null,
                        'category' => $collaboration->category ? [
                            'id' => $collaboration->category->id,
                            'name' => $collaboration->category->name,
                            'slug' => $collaboration->category->slug,
                        ] : ['id' => 0, 'name' => 'Tanpa Kategori', 'slug' => 'none'],
                        'user' => [
                            'id' => $collaboration->user->id,
                            'name' => $collaboration->user->name,
                        ],
                        'collaborators_count' => $collaboration->collaborators()->count(),
                        'chats_count' => $collaboration->chats()->count(),
                        'user_role' => $collaboratorInfo->role ?? 'member',
                        'created_at' => $collaboration->created_at->toISOString(),
                        'joined_at' => $collaboratorInfo->joined_at ?
                            \Carbon\Carbon::parse($collaboratorInfo->joined_at)->toISOString() :
                            $collaboration->created_at->toISOString(),
                    ];
                })
                ->sortByDesc('joined_at')
                ->values();

            // Manual pagination
            $page = $request->get('page', 1);
            $perPage = 10;
            $total = $collaborations->count();
            $items = $collaborations->slice(($page - 1) * $perPage, $perPage);

            return Inertia::render('profile/followed-collaboration', [
                'followedCollaborations' => [
                    'data' => $items,
                    'current_page' => $page,
                    'last_page' => ceil($total / $perPage),
                    'per_page' => $perPage,
                    'total' => $total,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error in followedCollaborations: ' . $e->getMessage());
            return Inertia::render('profile/followed-collaboration', [
                'followedCollaborations' => [
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 10,
                    'total' => 0,
                ],
            ]);
        }
    }
}
