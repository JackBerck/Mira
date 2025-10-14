<?php

use App\Http\Controllers\CollaborationController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\IdeaInsightController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Introduction / Landing Page
Route::get('/', function () {
    return Inertia::render('Introduction/Welcome');
})->name('welcome');

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
});

// Collaboration Routes
Route::get('kolaborasi', [CollaborationController::class, 'index'])->name('collaboration.index');
Route::get('kolaborasi/{collaboration:slug}', [CollaborationController::class, 'show'])->name('collaboration.show');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
