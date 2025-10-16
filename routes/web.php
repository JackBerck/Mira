<?php

use App\Http\Controllers\CollaborationController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\ForumInteractionController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\IdeaInsightController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    // Introduction / Landing Page
    Route::get('/', function () {
        return Inertia::render('introduction/welcome');
    })->name('welcome');
    Route::get('/fitur', function () {
        return Inertia::render('introduction/features');
    })->name('features');
    Route::get('/tentang', function () {
        return Inertia::render('introduction/about');
    })->name('about');
    Route::get('/kontak', function () {
        return Inertia::render('introduction/contact');
    })->name('contact');
    Route::post('/kontak', [\App\Http\Controllers\FeedbackController::class, 'store'])->name('feedback.store');
});

Route::resource("test", CollaborationController::class);

Route::prefix('beranda')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('dashboard');
    // collaboration

    Route::get('kolaborasi', [HomeController::class, 'collaborations'])->name('dashboard.collaborations');
    Route::get('kolaborasi/buat', [CollaborationController::class, 'create'])->name('collaboration.create');
    Route::post('kolaborasi', [CollaborationController::class, 'store'])->name('collaboration.store');
    Route::get('kolaborasi/{collaboration:slug}', [CollaborationController::class, 'show'])->name('collaboration.show');
    Route::put('kolaborasi/{collaboration:slug}', [CollaborationController::class, 'update'])->name('collaboration.update');
    Route::delete('kolaborasi/{collaboration:slug}', [CollaborationController::class, 'destroy'])->name('collaboration.destroy');

    // forum
    Route::get('forum/buat', [ForumController::class, 'create'])->name('forum.create');
    Route::get('forum/{forum:slug}', [ForumController::class, 'show'])->name('forum.show');
    Route::post('forum', [ForumController::class, 'store'])->name('forum.store');
    Route::get('forum/{forum:slug}/edit', [ForumController::class, 'edit'])->name('forum.edit');
    Route::put('forum/{forum:slug}', [ForumController::class, 'update'])->name('forum.update');
    Route::delete('forum/{forum:slug}', [ForumController::class, 'destroy'])->name('forum.destroy');
    Route::post('forum/{forum:id}/like', [ForumInteractionController::class, 'toggleLike'])->name('forum.like');
    Route::post('forum/{forum:id}/comment', [ForumInteractionController::class, 'storeComment'])->name('forum.comment');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // Mari Berpikir / Idea Insight
    Route::get('mari-berpikir', [IdeaInsightController::class, 'index'])->name('idea-insight');

    // PINDAHKAN API ROUTES KE SINI (dari api.php)
    Route::prefix('api/think')->group(function () {
        Route::post('/chat', [IdeaInsightController::class, 'chat']);
        Route::post('/export', [IdeaInsightController::class, 'export']);
    });

    // Profile
    // Profile Routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::post('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');

        // Update Password
        Route::put('/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');

        // Skills & Interests
        Route::get('/skills-interests', [ProfileController::class, 'skillsInterests'])->name('profile.skills-interests');
        Route::put('/skills-interests', [ProfileController::class, 'updateSkillsInterests'])->name('profile.skills-interests.update');

        // Portfolio
        Route::get('/portfolio', [ProfileController::class, 'portfolio'])->name('profile.portfolio');
        Route::post('/portfolio', [ProfileController::class, 'storePortfolio'])->name('profile.portfolio.store');
        Route::put('/portfolio/{portfolioItem}', [ProfileController::class, 'updatePortfolio'])->name('profile.portfolio.update');
        Route::delete('/portfolio/{portfolioItem}', [ProfileController::class, 'destroyPortfolio'])->name('profile.portfolio.destroy');

        // Forum
        Route::get('/my-forums', [ProfileController::class, 'myForums'])->name('profile.my-forums');
        Route::get('/liked-forums', [ProfileController::class, 'likedForums'])->name('profile.liked-forums');
        Route::get('/commented-forums', [ProfileController::class, 'commentedForums'])->name('profile.commented-forums');

        // Collaborations
        Route::get('/my-collaborations', [ProfileController::class, 'myCollaborations'])->name('profile.my-collaborations');
        Route::get('/followed-collaborations', [ProfileController::class, 'followedCollaborations'])->name('profile.followed-collaborations');
    });
});

// forum
Route::get('forum', [ForumController::class, 'index'])->name('forum.index');

// Collaboration Routes
Route::get('kolaborasi', [CollaborationController::class, 'index'])->name('collaboration.index');
Route::get('kolaborasi/{collaboration:slug}', [CollaborationController::class, 'show'])->name('collaboration.show');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
