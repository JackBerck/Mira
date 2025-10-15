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
            $imagePath = $request->file('image')->store('forums', 'public');
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

        return redirect()->route('forum.index')->with('success', 'Topik forum berhasil dibuat!');
    }

    public function show(Forum $forum): \Inertia\Response|\Inertia\ResponseFactory
    {
        $forum->load([
            'category', 
            'user',
            'comments' => function ($query) {
                $query->latest()->with('user');
            },
        ])->loadCount(['comments', 'likes']);

        $isLikedByUser = Auth::check() ? $forum->likes()->where('user_id', Auth::id())->exists() : false;

        return Inertia::render('forum/show/page', [
            'forum' => $forum,
            'isLikedByUser' => $isLikedByUser,
        ]);
    }

    public function edit(Forum $forum)
    {
        // $this->authorize('update', $forum);
        return Inertia::render('forum/buat/page', [
            'initial' => $forum->load('category'),
            'categories' => ForumCategory::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, Forum $forum)
    {
        // $this->authorize('update', $forum);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'forum_category_id' => ['required', 'exists:forum_categories,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'image' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        if ($forum->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . $forum->id;
        }

        if ($request->hasFile('image')) {
            if ($forum->image) {
                Storage::disk('public')->delete($forum->image);
            }
            $validated['image'] = $request->file('image')->store('forums', 'public');
        }

        $forum->update($validated);

        return redirect()->route('forum.show', $forum)->with('success', 'Topik forum berhasil diperbarui!');
    }

    public function destroy(Forum $forum)
    {
        // $this->authorize('delete', $forum);

        if ($forum->image) {
            Storage::disk('public')->delete($forum->image);
        }
        
        $forum->delete();

        return redirect()->route('forum.index')->with('success', 'Topik forum berhasil dihapus!');
    }
}