<?php

use App\Http\Controllers\CollaborationController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\IdeaInsightController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('beranda', [HomeController::class, 'index'])->name('dashboard');
    Route::get('beranda/kolaborasi', [HomeController::class, 'collaborations'])->name('dashboard.collaborations');

    // collaboration
    Route::get('kolaborasi/buat', [CollaborationController::class, 'create'])->name('collaboration.create');
    Route::post('kolaborasi', [CollaborationController::class, 'store'])->name('collaboration.store');
    Route::put('kolaborasi/{collaboration:slug}', [CollaborationController::class, 'update'])->name('collaboration.update');
    Route::delete('kolaborasi/{collaboration:slug}', [CollaborationController::class, 'destroy'])->name('collaboration.destroy');

    // Mari Berpikir / Idea Insight
    Route::get('mari-berpikir', [IdeaInsightController::class, 'index'])->name('idea-insight');

    // PINDAHKAN API ROUTES KE SINI (dari api.php)
    Route::prefix('api/think')->group(function () {
        Route::post('/chat', [IdeaInsightController::class, 'chat']);
        Route::post('/export', [IdeaInsightController::class, 'export']);
    });

    // Profile
    Route::get('profil', [\App\Http\Controllers\Settings\ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('profil/keterampilan-dan-minat', [\App\Http\Controllers\Settings\ProfileController::class, 'skillsInterests'])->name('profile.skills-interests');
    Route::get('profil/portofolio', [\App\Http\Controllers\Settings\ProfileController::class, 'portfolio'])->name('profile.portfolio');
    Route::patch('profil', [\App\Http\Controllers\Settings\ProfileController::class, 'update'])->name('profile.update');
});

// Collaboration Routes
Route::get('kolaborasi', [CollaborationController::class, 'index'])->name('collaboration.index');
Route::get('kolaborasi/{collaboration:slug}', [CollaborationController::class, 'show'])->name('collaboration.show');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
