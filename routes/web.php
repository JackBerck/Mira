<?php

use App\Http\Controllers\CollaborationController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\ForumInteractionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // collaboration
    Route::get('kolaborasi/buat', [CollaborationController::class, 'create'])->name('collaboration.create');
    Route::post('kolaborasi', [CollaborationController::class, 'store'])->name('collaboration.store');
    Route::put('kolaborasi/{collaboration:slug}', [CollaborationController::class, 'update'])->name('collaboration.update');
    Route::delete('kolaborasi/{collaboration:slug}', [CollaborationController::class, 'destroy'])->name('collaboration.destroy');

    // forum
    Route::get('forum/buat', [ForumController::class, 'create'])->name('forum.buat');
    Route::get('forum/{forum:slug}', [ForumController::class, 'show'])->name('forum.show');
    Route::post('forum', [ForumController::class, 'store'])->name('forum.store');
    Route::get('forum/{forum:slug}/edit', [ForumController::class, 'edit'])->name('forum.edit');
    Route::put('forum/{forum:slug}', [ForumController::class, 'update'])->name('forum.update');
    Route::delete('forum/{forum:slug}', [ForumController::class, 'destroy'])->name('forum.destroy');
    Route::post('forum/{forum:id}/like', [ForumInteractionController::class, 'toggleLike'])->name('forum.like');
    Route::post('forum/{forum:id}/comment', [ForumInteractionController::class, 'storeComment'])->name('forum.comment');
});

// forum
Route::get('forum', [ForumController::class, 'index'])->name('forum.index');


// Collaboration Routes
Route::get('kolaborasi', [CollaborationController::class, 'index'])->name('collaboration.index');
Route::get('kolaborasi/{collaboration:slug}', [CollaborationController::class, 'show'])->name('collaboration.show');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
