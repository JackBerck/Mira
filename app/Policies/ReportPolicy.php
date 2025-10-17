<?php
// filepath: d:\Code\Mira\app\Policies\ReportPolicy.php

namespace App\Policies;

use App\Models\Report;
use App\Models\User;

class ReportPolicy
{
    /**
     * Determine if the user can view any reports
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine if the user can view the report
     */
    public function view(User $user, Report $report): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine if the user can update the report
     */
    public function update(User $user, Report $report): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine if the user can delete the report
     */
    public function delete(User $user, Report $report): bool
    {
        return $user->hasRole('admin');
    }
}
