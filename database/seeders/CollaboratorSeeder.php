<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CollaboratorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $collaborators = [
            // Collaboration 1: Pengembangan Aplikasi Mobile untuk Pendidikan
            ['role' => 'Flutter Developer', 'collaboration_id' => 1, 'user_id' => 2],
            ['role' => 'UI/UX Designer', 'collaboration_id' => 1, 'user_id' => 3],
            ['role' => 'Project Owner', 'collaboration_id' => 1, 'user_id' => 1],

            // Collaboration 2: Proyek Penanaman Pohon di Area Perkotaan
            ['role' => 'Event Organizer', 'collaboration_id' => 2, 'user_id' => 4],
            ['role' => 'Promotor', 'collaboration_id' => 2, 'user_id' => 5],
            ['role' => 'Coordinator', 'collaboration_id' => 2, 'user_id' => 2],

            // Collaboration 3: Kampanye Kesadaran Kesehatan Mental
            ['role' => 'Content Writer', 'collaboration_id' => 3, 'user_id' => 1],
            ['role' => 'Graphic Designer', 'collaboration_id' => 3, 'user_id' => 2],
            ['role' => 'Campaign Leader', 'collaboration_id' => 3, 'user_id' => 3],

            // Collaboration 4: Inisiatif Pengurangan Sampah Plastik
            ['role' => 'Community Organizer', 'collaboration_id' => 4, 'user_id' => 4],
            ['role' => 'Educator', 'collaboration_id' => 4, 'user_id' => 5],
            ['role' => 'Online Campaigner', 'collaboration_id' => 4, 'user_id' => 1],

            // Collaboration 5: Pengembangan Platform E-Commerce Lokal
            ['role' => 'Backend Developer', 'collaboration_id' => 5, 'user_id' => 2],
            ['role' => 'Frontend Developer', 'collaboration_id' => 5, 'user_id' => 3],
            ['role' => 'Project Owner', 'collaboration_id' => 5, 'user_id' => 1],
        ];

        foreach ($collaborators as $collaborator) {
            \App\Models\Collaborator::create($collaborator);
        }
    }
}