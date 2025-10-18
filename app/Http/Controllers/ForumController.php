<?php

namespace App\Http\Controllers;

use App\Models\Forum;
use App\Models\ForumCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ForumController extends Controller
{
    public function index(Request $request): \Inertia\Response|\Inertia\ResponseFactory
    {
        $query = Forum::with(['category', 'user'])
            ->withCount('likes', 'comments');

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $categorySlug = $request->category;
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        if ($request->filled('sort')) {
            switch ($request->sort) {
                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;
                case 'most_comments':
                    $query->orderBy('comments_count', 'desc');
                    break;
                case 'popularity':
                    $query->orderBy('likes_count', 'desc');
                    break;
                case 'latest':
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $forums = $query->paginate(12)->withQueryString()->through(function ($forum) {
            $forum->image = $forum->image ? asset('storage/' . $forum->image) : null;
            return $forum;
        });


        return Inertia::render('forum/page', [
            'forums' => $forums,
            'categories' => ForumCategory::all(),
            'filters'  => $request->only(['search', 'category', 'sort']),
        ]);
    }

    public function create(): \Inertia\Response|\Inertia\ResponseFactory
    {
        return Inertia::render('forum/buat/page', [
            'categories' => ForumCategory::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'forum_category_id' => 'required|exists:forum_categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('forum_images', 'public');
        }

        Forum::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . uniqid(),
            'description' => $validated['description'],
            'forum_category_id' => $validated['forum_category_id'],
            'image' => $imagePath,
            'tags' => $validated['tags'] ?? [],
            'user_id' => Auth::id()
        ]);

        return redirect()->route('dashboard')->with('success', 'Topik forum berhasil dibuat!');
    }

    public function show($slug)
    {
        $forum = Forum::with([
            'category',
            'user',
            'comments' => function ($query) {
                $query->with('user')
                    ->whereNull('deleted_at')
                    ->orderBy('created_at', 'desc');
            }
        ])
            ->withCount('likes', 'comments')
            ->where('slug', $slug)
            ->firstOrFail();

        $isLiked = false;
        $currentUserId = null;

        if (Auth::check()) {
            $currentUserId = Auth::id();
            $isLiked = $forum->likes()->where('user_id', $currentUserId)->exists();
        }

        // Format comments dengan informasi user ownership
        $formattedComments = $forum->comments->map(function ($comment) use ($currentUserId) {
            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at->diffForHumans(),
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->name,
                    'avatar' => $comment->user->profile_picture ?
                        asset('storage/' . $comment->user->profile_picture) :
                        'https://ui-avatars.com/api/?name=' . urlencode($comment->user->name),
                ],
                'is_owner' => $currentUserId ? $comment->user_id === $currentUserId : false,
            ];
        });

        // Parse tags - handle both string and array
        $tags = $forum->tags;
        if (is_string($tags)) {
            $tags = json_decode($tags, true) ?? [];
        }
        if (!is_array($tags)) {
            $tags = [];
        }

        return Inertia::render('forum/show/page', [
            'forum' => [
                'id' => $forum->id,
                'title' => $forum->title,
                'slug' => $forum->slug,
                'description' => $forum->description,
                'image' => $forum->image ? asset('storage/' . $forum->image) : null,
                'tags' => $tags, // Already parsed as array
                'category' => [
                    'id' => $forum->category->id,
                    'name' => $forum->category->name,
                    'slug' => $forum->category->slug,
                ],
                'user' => [
                    'id' => $forum->user->id,
                    'name' => $forum->user->name,
                    'avatar' => $forum->user->profile_picture ?
                        asset('storage/' . $forum->user->profile_picture) :
                        'https://ui-avatars.com/api/?name=' . urlencode($forum->user->name),
                ],
                'likes_count' => $forum->likes_count,
                'comments_count' => $forum->comments_count,
                'created_at' => $forum->created_at->diffForHumans(),
            ],
            'comments' => $formattedComments,
            'isLiked' => $isLiked,
            'currentUserId' => $currentUserId,
            'isAuthenticated' => Auth::check(),
        ]);
    }

    public function edit($slug)
    {
        $forum = Forum::where('slug', $slug)->firstOrFail();

        // Check if user is owner or admin
        $user = auth()->user();
        if (!$user) {
            abort(401, 'Unauthorized');
        }

        if ($forum->user_id !== $user->id && !$user->hasRole('admin')) {
            abort(403, 'Anda tidak memiliki izin untuk mengedit forum ini.');
        }

        // Parse tags if it's a string
        $tags = $forum->tags;
        if (is_string($tags)) {
            $tags = json_decode($tags, true) ?? [];
        }
        if (!is_array($tags)) {
            $tags = [];
        }

        return Inertia::render('forum/edit/page', [
            'initial' => [
                'title' => $forum->title,
                'slug' => $forum->slug,
                'description' => $forum->description,
                'forum_category_id' => $forum->forum_category_id,
                'tags' => $tags,
                'image' => $forum->image ? asset('storage/' . $forum->image) : null,
            ],
            'categories' => ForumCategory::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, $slug)
    {
        $forum = Forum::where('slug', $slug)->firstOrFail();

        // Check if user is owner or admin
        $user = auth()->user();
        if (!$user) {
            abort(401, 'Unauthorized');
        }

        if ($forum->user_id !== $user->id && !$user->hasRole('admin')) {
            abort(403, 'Anda tidak memiliki izin untuk mengedit forum ini.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'forum_category_id' => 'required|exists:forum_categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Generate new slug if title changed
        if ($forum->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . $forum->id;
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($forum->image) {
                Storage::disk('public')->delete($forum->image);
            }
            $validated['image'] = $request->file('image')->store('forum_images', 'public');
        }

        $forum->update($validated);

        return redirect()->route('forum.show', $forum->slug)
            ->with('success', 'Forum berhasil diperbarui!');
    }

    public function destroy($slug)
    {
        $forum = Forum::where('slug', $slug)->firstOrFail();

        // Check if user is owner or admin
        $user = auth()->user();
        if (!$user) {
            abort(401, 'Unauthorized');
        }

        if ($forum->user_id !== $user->id && !$user->hasRole('admin')) {
            abort(403, 'Anda tidak memiliki izin untuk menghapus forum ini.');
        }

        // Delete image if exists
        if ($forum->image) {
            Storage::disk('public')->delete($forum->image);
        }

        $forum->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Forum berhasil dihapus!');
    }
}
