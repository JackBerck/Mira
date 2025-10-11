<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ForumLikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $forumLikes = [
            ['forum_id' => 1, 'user_id' => 2],
            ['forum_id' => 1, 'user_id' => 3],
            ['forum_id' => 2, 'user_id' => 1],
            ['forum_id' => 2, 'user_id' => 3],
            ['forum_id' => 3, 'user_id' => 1],
            ['forum_id' => 3, 'user_id' => 2],
        ];

        foreach ($forumLikes as $like) {
            \App\Models\ForumLike::create($like);
        }
    }
}
