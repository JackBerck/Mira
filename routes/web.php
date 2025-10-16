<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\CollaborationController;
use App\Http\Controllers\DirectMessageController;
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

Route::prefix('beranda')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('dashboard');
    // collaboration

    Route::get('kolaborasi', [HomeController::class, 'collaborations'])->name('dashboard.collaborations');
    Route::get('kolaborasi/buat', [CollaborationController::class, 'create'])->name('collaboration.create');
    Route::post('kolaborasi', [CollaborationController::class, 'store'])->name('collaboration.store');
    Route::get('kolaborasi/{collaboration:slug}/edit', [CollaborationController::class, 'edit'])->name('collaboration.edit');
    Route::get('kolaborasi/{collaboration:slug}', [CollaborationController::class, 'show'])->name('collaboration.show');
    Route::put('kolaborasi/{collaboration:slug}', [CollaborationController::class, 'update'])->name('collaboration.update');
    Route::delete('kolaborasi/{collaboration:slug}', [CollaborationController::class, 'destroy'])->name('collaboration.destroy');
    
    // Collaboration Members Management
    Route::post('kolaborasi/{collaboration:slug}/member', [CollaborationController::class, 'addMember'])->name('collaboration.member.add');
    Route::delete('kolaborasi/{collaboration:slug}/member/{collaborator}', [CollaborationController::class, 'removeMember'])->name('collaboration.member.remove');
    Route::get('kolaborasi/{collaboration:slug}/search-users', [CollaborationController::class, 'searchUsers'])->name('collaboration.search-users');

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
    Route::get('/pesan', [ChatController::class, 'index'])->name('chats.index');
    Route::post('/pesan', [ChatController::class, 'store'])->name('chats.store');
    Route::get('/pesan/total-unread-count', [ChatController::class, 'getTotalUnreadCount'])->name('chats.total-unread-count');
    Route::get('/pesan/{collaborationId}/messages', [ChatController::class, 'getMessages'])->name('chats.messages');
    Route::get('/pesan/{collaborationId}/unread-count', [ChatController::class, 'getUnreadCount'])->name('chats.unread-count');
    
    // Direct Messages
    Route::get('/direct-messages/conversations', [DirectMessageController::class, 'getConversations'])->name('direct-messages.conversations');
    Route::get('/direct-messages/{userId}/messages', [DirectMessageController::class, 'getMessages'])->name('direct-messages.messages');
    Route::post('/direct-messages', [DirectMessageController::class, 'store'])->name('direct-messages.store');

    // Notifications
    Route::get('/notifikasi', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifikasi/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifikasi/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::delete('/notifikasi/{id}', [\App\Http\Controllers\NotificationController::class, 'destroy'])->name('notifications.destroy');
    Route::get('/notifikasi/unread-count', [\App\Http\Controllers\NotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');

    // Collaboration Join Requests
    Route::post('/kolaborasi/{collaboration}/join', [\App\Http\Controllers\CollaborationJoinRequestController::class, 'store'])->name('collaboration.join');
    Route::post('/kolaborasi/join-request/{joinRequest}/accept', [\App\Http\Controllers\CollaborationJoinRequestController::class, 'accept'])->name('collaboration.join.accept');
    Route::post('/kolaborasi/join-request/{joinRequest}/reject', [\App\Http\Controllers\CollaborationJoinRequestController::class, 'reject'])->name('collaboration.join.reject');
    Route::get('/kolaborasi/{collaborationId}/pending-requests', [\App\Http\Controllers\CollaborationJoinRequestController::class, 'getPendingRequests'])->name('collaboration.pending-requests');

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
