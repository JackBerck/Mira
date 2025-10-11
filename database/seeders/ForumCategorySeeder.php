<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ForumCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $forumCategories = [
            ['name' => 'Teknologi'],
            ['name' => 'Kesehatan'],
            ['name' => 'Pendidikan'],
            ['name' => 'Lingkungan'],
            ['name' => 'Seni dan Budaya'],
            ['name' => 'Ekonomi dan Bisnis'],
            ['name' => 'Sosial dan Politik'],
            ['name' => 'Olahraga dan Rekreasi'],
        ];

        foreach ($forumCategories as $category) {
            \App\Models\ForumCategory::create($category);
        }
    }
}
