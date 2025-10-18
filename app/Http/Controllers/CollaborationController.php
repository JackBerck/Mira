<?php

namespace App\Http\Controllers;

use App\Models\Collaboration;
use App\Models\Collaborator;
use App\Models\ForumCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->category);
            });
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

    public function create(Request $request): \Inertia\Response|\Inertia\ResponseFactory
    {
        $categories = ForumCategory::all();
        $finalDraft = null;
        if($request->has('draftId')) {
            $draftId = $request->input('draftId');
            $key = "draft_collab_" . $draftId;
            $draftData = session()->get($key);
            if ($draftData) {
                $description = "";
                if (!empty($draftData['problem'])) {
                    $description .= "Masalah yang ingin dipecahkan:\n" . $draftData['problem'] . "\n\n";
                }
                if (!empty($draftData['goals'])) {
                    $description .= "Tujuan Kolaborasi:\n";
                    foreach ($draftData['goals'] as $goal) {
                        $description .= "- " . $goal . "\n";
                    }
                }

                $allSkills = [];
                if (!empty($draftData['roles'])) {
                    foreach ($draftData['roles'] as $role) {
                        if (!empty($role['skills'])) {
                            // Gabungkan semua skill dari semua peran
                            $allSkills = array_merge($allSkills, $role['skills']);
                        }
                    }
                }
                $skillsString = implode(', ', array_unique($allSkills));
                $categoryName = $draftData['category'] ?? '';
                $category = ForumCategory::where('name', $categoryName)->first();
                $finalDraft = [
                    'title' => $draftData['title'] ?? '',
                    'description' => $draftData['description'] ?? $description,
                    'category_id' => $category ? $category->id : null,
                    'status' => $draftData['status'] ?? '',
                    'skills' => $skillsString,
                    'image' => null, 
                    'slug' => null,  
                ];
                session()->forget($key);
            }
        }

        return inertia('collaboration/buat/page', [
            'categories' => $categories,
            'draft' => $finalDraft,
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
            $storedPath = $request->file('image')->store('collaboration_images', 'public');
            $imagePath = '/storage/' . $storedPath;
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
        $collaboration->load([
            'category',
            'user',
            'collaborators.user',
            'chats' => function ($query) {
                $query->latest()->take(10);
            }
        ]);

        // Transform collaborators data - exclude owner from collaborators list
        $collaboratorsData = $collaboration->collaborators
            ->filter(function ($collaborator) use ($collaboration) {
                // Exclude owner from collaborators list
                return $collaborator->user_id !== $collaboration->user_id;
            })
            ->map(function ($collaborator) {
                return [
                    'id' => $collaborator->id,
                    'role' => $collaborator->role,
                    'user' => [
                        'id' => $collaborator->user->id,
                        'name' => $collaborator->user->name,
                        'avatar' => $collaborator->user->image ? asset('storage/' . $collaborator->user->image) : null,
                    ],
                    'joined_at' => $collaborator->created_at->toISOString(),
                ];
            })
            ->values(); // Reset array keys after filtering

        // Ensure skills_needed is always an array
        $skills = $collaboration->skills_needed;
        if (!is_array($skills)) {
            $skills = $skills ? (is_string($skills) ? json_decode($skills, true) ?? [] : []) : [];
        }

        // Transform collaboration data
        $collaborationData = [
            'id' => $collaboration->id,
            'title' => $collaboration->title,
            'slug' => $collaboration->slug,
            'description' => $collaboration->description,
            'skills_needed' => $skills,
            'status' => $collaboration->status,
            'image' => $collaboration->image_url,
            'forum_category_id' => $collaboration->forum_category_id,
            'category' => [
                'id' => $collaboration->category->id,
                'name' => $collaboration->category->name,
                'slug' => $collaboration->category->slug,
            ],
            'user' => [
                'id' => $collaboration->user->id,
                'name' => $collaboration->user->name,
                'avatar' => $collaboration->user->image ? asset('storage/' . $collaboration->user->image) : null,
                // 'avatar' => $collaboration->user->image ? asset('storage/' . $collaboration->user->image): null,
            ],
            'collaborators' => $collaboratorsData,
            'collaborators_count' => $collaboratorsData->count(),
            'chats_count' => $collaboration->chats->count(),
            'created_at' => $collaboration->created_at->toISOString(),
            'updated_at' => $collaboration->updated_at->toISOString(),
        ];

        return inertia('collaboration/show/page', [
            'collaboration' => $collaborationData,
        ]);
    }

    public function update(Request $request, Collaboration $collaboration): \Illuminate\Http\RedirectResponse
    {
        // Check if user is owner
        if ($collaboration->user_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki izin untuk mengedit kolaborasi ini.');
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category_id' => 'sometimes|exists:forum_categories,id',
            'status' => 'sometimes|in:open,in_progress,completed',
            'skills_needed' => 'nullable|array',
            'skills_needed.*' => 'string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if (isset($validated['category_id'])) {
            $validated['forum_category_id'] = $validated['category_id'];
            unset($validated['category_id']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($collaboration->image) {
                $oldImagePath = str_replace('/storage/', '', $collaboration->image);
                Storage::disk('public')->delete($oldImagePath);
            }

            // Store new image
            $imagePath = $request->file('image')->store('collaboration_images', 'public');
            $validated['image'] = '/storage/' . $imagePath;
        }

        $collaboration->update($validated);

        return redirect()->route('collaboration.show', $collaboration->slug)
            ->with('success', 'Kolaborasi berhasil diperbarui!');
    }

    public function edit(Collaboration $collaboration): \Inertia\Response|\Inertia\ResponseFactory
    {
        // Check if user is owner
        if ($collaboration->user_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki izin untuk mengedit kolaborasi ini.');
        }

        $collaboration->load([
            'category',
            'user',
            'collaborators.user',
        ]);

        $categories = ForumCategory::all();

        // Transform collaborators data - exclude owner from collaborators list
        $collaboratorsData = $collaboration->collaborators
            ->filter(function ($collaborator) use ($collaboration) {
                // Exclude owner from collaborators list
                return $collaborator->user_id !== $collaboration->user_id;
            })
            ->map(function ($collaborator) {
                return [
                    'id' => $collaborator->id,
                    'role' => $collaborator->role,
                    'user' => [
                        'id' => $collaborator->user->id,
                        'name' => $collaborator->user->name,
                        'email' => $collaborator->user->email,
                        'avatar' => $collaborator->user->image ? asset('storage/' . $collaborator->user->image) : null,
                    ],
                    'joined_at' => $collaborator->created_at->toISOString(),
                ];
            })
            ->values(); // Reset array keys after filtering

        // Ensure skills_needed is always an array
        $skills = $collaboration->skills_needed;
        if (!is_array($skills)) {
            $skills = $skills ? (is_string($skills) ? json_decode($skills, true) ?? [] : []) : [];
        }

        $collaborationData = [
            'id' => $collaboration->id,
            'title' => $collaboration->title,
            'slug' => $collaboration->slug,
            'description' => $collaboration->description,
            'skills_needed' => $skills,
            'status' => $collaboration->status,
            'image' => $collaboration->image_url,
            'forum_category_id' => $collaboration->forum_category_id,
            'category' => [
                'id' => $collaboration->category->id,
                'name' => $collaboration->category->name,
                'slug' => $collaboration->category->slug,
            ],
            'user' => [
                'id' => $collaboration->user->id,
                'name' => $collaboration->user->name,
                'avatar' => $collaboration->user->image ? asset('storage/' . $collaboration->user->image) : null,
            ],
            'collaborators' => $collaboratorsData,
            'collaborators_count' => $collaboratorsData->count(),
            'created_at' => $collaboration->created_at->toISOString(),
            'updated_at' => $collaboration->updated_at->toISOString(),
        ];

        return inertia('collaboration/edit/page', [
            'collaboration' => $collaborationData,
            'categories' => $categories,
        ]);
    }

    public function addMember(Request $request, Collaboration $collaboration): \Illuminate\Http\RedirectResponse
    {
        // Check if user is owner
        if ($collaboration->user_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki izin untuk menambah anggota.');
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|string|max:255',
        ]);

        // Check if user is already a member
        $existingMember = $collaboration->collaborators()
            ->where('user_id', $validated['user_id'])
            ->first();

        if ($existingMember) {
            return back()->with('error', 'User sudah menjadi anggota kolaborasi ini.');
        }

        // Check if user is the owner
        if ($collaboration->user_id == $validated['user_id']) {
            return back()->with('error', 'Tidak dapat menambahkan owner sebagai anggota.');
        }

        // Create new collaborator
        $collaborator = Collaborator::create([
            'collaboration_id' => $collaboration->id,
            'user_id' => $validated['user_id'],
            'role' => $validated['role'],
        ]);

        // Send notification to the added user
        $user = User::find($validated['user_id']);
        $user->notify(new \App\Notifications\AddedToCollaborationNotification(
            $collaboration,
            auth()->user(),
            $validated['role']
        ));

        return back()->with('success', 'Anggota berhasil ditambahkan ke kolaborasi.');
    }

    public function removeMember(Collaboration $collaboration, Collaborator $collaborator): \Illuminate\Http\RedirectResponse
    {
        // Check if user is owner
        if ($collaboration->user_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki izin untuk menghapus anggota.');
        }

        // Verify the collaborator belongs to this collaboration
        if ($collaborator->collaboration_id !== $collaboration->id) {
            abort(404, 'Anggota tidak ditemukan dalam kolaborasi ini.');
        }

        // Prevent removing the owner (extra safety check)
        if ($collaborator->user_id === $collaboration->user_id) {
            abort(403, 'Tidak dapat menghapus owner dari kolaborasi.');
        }

        $collaborator->delete();

        return back()->with('success', 'Anggota berhasil dihapus dari kolaborasi.');
    }

    public function searchUsers(Request $request, Collaboration $collaboration): \Illuminate\Http\JsonResponse
    {
        // Check if user is owner
        if ($collaboration->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $search = $request->input('search', '');

        // Get users who are not already members and not the owner
        $users = User::where(function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        })
            ->where('id', '!=', $collaboration->user_id)
            ->whereNotIn('id', function ($query) use ($collaboration) {
                $query->select('user_id')
                    ->from('collaborators')
                    ->where('collaboration_id', $collaboration->id);
            })
            ->limit(10)
            ->get(['id', 'name', 'email', 'image']);

        // Transform image to avatar for frontend consistency
        $users = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->image ? asset('storage/' . $user->image) : null,
            ];
        });

        return response()->json($users);
    }

    public function destroy(Collaboration $collaboration): \Illuminate\Http\RedirectResponse
    {
        // Check if user is owner or admin
        $user = auth()->user();

        if (!$user) {
            abort(401, 'Unauthorized');
        }

        if ($collaboration->user_id !== $user->id && !$user->hasRole('admin')) {
            abort(403, 'Anda tidak memiliki izin untuk menghapus kolaborasi ini.');
        }


        $collaboration->delete();

        return redirect()->route('collaboration.index')
            ->with('success', 'Kolaborasi berhasil dihapus!');
    }
}
