<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Collaboration;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('collaboration.{collaborationId}', function ($user, $collaborationId) {
    $collaboration = Collaboration::find($collaborationId);
    
    // Check if user is the owner or a collaborator
    if (!$collaboration) {
        return false;
    }
    
    return $collaboration->user_id === $user->id || 
           $collaboration->collaborators()->where('user_id', $user->id)->exists();
});
