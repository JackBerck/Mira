<?php
// filepath: d:\Code\Mira\app\Http\Controllers\AdminReportController.php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\User;
use App\Notifications\NewReportNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

class AdminReportController extends Controller
{
    /**
     * Store a new report
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reportable_type' => 'required|string',
            'reportable_id' => 'required|integer',
            'reason' => 'required|string|in:spam,inappropriate,harassment,misinformation,copyright,other',
            'message' => 'required|string|max:1000',
        ]);

        // Create the report
        $report = Report::create([
            'user_id' => Auth::id(),
            'reportable_type' => $validated['reportable_type'],
            'reportable_id' => $validated['reportable_id'],
            'reason' => $validated['reason'],
            'message' => $validated['message'],
            'status' => 'pending',
        ]);

        // Get all admins
        $admins = User::role('admin')->get();

        // Send notification to all admins
        Notification::send($admins, new NewReportNotification($report));

        return back()->with('success', 'Laporan berhasil dikirim ke admin. Terima kasih atas kontribusi Anda!');
    }

    /**
     * Display reports (for admin)
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Report::class);

        $query = Report::with(['user', 'reportable', 'reviewer'])
            ->latest();

        // Filter by status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('message', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $reports = $query->paginate(20);

        return inertia('admin/reports/index', [
            'reports' => $reports,
            'filters' => $request->only(['status', 'search']),
            'stats' => [
                'pending' => Report::where('status', 'pending')->count(),
                'reviewed' => Report::where('status', 'reviewed')->count(),
                'resolved' => Report::where('status', 'resolved')->count(),
                'rejected' => Report::where('status', 'rejected')->count(),
            ],
        ]);
    }

    /**
     * Show single report (for admin)
     */
    public function show(Report $report)
    {
        $this->authorize('view', $report);

        $report->load(['user', 'reportable', 'reviewer']);

        return inertia('admin/reports/show', [
            'report' => $report,
        ]);
    }

    /**
     * Update report status (for admin)
     */
    public function update(Request $request, Report $report)
    {
        $this->authorize('update', $report);

        $validated = $request->validate([
            'status' => 'required|string|in:reviewed,resolved,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $report->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? null,
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Status laporan berhasil diperbarui.');
    }
}
