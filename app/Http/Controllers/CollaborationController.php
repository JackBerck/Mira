<?php

namespace App\Http\Controllers;

use App\Models\Collaboration;
use App\Models\ForumCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CollaborationController extends Controller
{
    public function index(Request $request): \Inertia\Response|\Inertia\ResponseFactory
    {
        $query = Collaboration::with(['category', 'user'])
            ->orderBy('created_at', 'desc');

        // Filter by search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category') && $request->category !== 'Semua') {
            $query->where('forum_category_id', $request->category);
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }

        // Sort
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'latest':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;
                case 'title':
                    $query->orderBy('title', 'asc');
                    break;
            }
        }

        $collaborations = $query->paginate(12);

        return inertia('collaboration/page', [
            'collaborations' => $collaborations,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'status' => $request->status,
                'sort' => $request->sort,
            ],
        ]);
    }

    public function create(): \Inertia\Response|\Inertia\ResponseFactory
    {
        $categories = ForumCategory::all();

        return inertia('collaboration/buat/page', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:forum_categories,id',
            'status' => 'required|in:open,in_progress,completed',
            'skills_needed' => 'nullable|array',
            'skills_needed.*' => 'string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('collaborations', 'public');
        }

        $collaboration = Collaboration::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'description' => $validated['description'],
            'forum_category_id' => $validated['category_id'],
            'status' => $validated['status'],
            'skills_needed' => $validated['skills_needed'] ?? [],
            'image' => $imagePath,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('collaboration.show', $collaboration->slug)
            ->with('success', 'Kolaborasi berhasil dibuat!');
    }

    public function show(Collaboration $collaboration): \Inertia\Response|\Inertia\ResponseFactory
    {
        $collaboration->load(['category', 'user']);

        return inertia('collaboration/show/page', [
            'collaboration' => $collaboration,
        ]);
    }

    public function update(Request $request, Collaboration $collaboration): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category_id' => 'sometimes|exists:forum_categories,id',
            'status' => 'sometimes|in:open,in_progress,completed',
            'skills_needed' => 'nullable|array',
            'skills_needed.*' => 'string',
            'image' => 'nullable|string',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if (isset($validated['category_id'])) {
            $validated['forum_category_id'] = $validated['category_id'];
            unset($validated['category_id']);
        }

        $collaboration->update($validated);

        return redirect()->route('collaboration.show', $collaboration->slug)
            ->with('success', 'Kolaborasi berhasil diperbarui!');
    }

    public function destroy(Collaboration $collaboration): \Illuminate\Http\RedirectResponse
    {
        $collaboration->delete();

        return redirect()->route('collaboration.index')
            ->with('success', 'Kolaborasi berhasil dihapus!');
    }
}
