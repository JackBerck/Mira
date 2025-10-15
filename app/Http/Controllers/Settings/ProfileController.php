<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
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
        // In future, load from portfolio model
        $portfolioItems = []; // Load from database

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
