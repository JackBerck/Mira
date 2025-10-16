<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\PortfolioItem;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
}
