<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Alice Johnson',
                'email' => 'alice@example.com',
                'password' => 'password',
                'bio' => 'Full-stack developer with a passion for open-source projects.',
                'skills' => json_encode(['PHP', 'JavaScript', 'Laravel', 'Vue.js']),
                'interests' => json_encode(['Open Source', 'Web Development', 'AI']),
                'portfolio_url' => 'https://alice.dev',
                'image' => 'profile_images/alice.png',
            ],
            [
                'name' => 'Bob Smith',
                'email' => 'bob@example.com',
                'password' => 'password',
                'bio' => 'Backend developer with a love for database optimization.',
                'skills' => json_encode(['PHP', 'MySQL', 'Laravel']),
                'interests' => json_encode(['Databases', 'API Development']),
                'portfolio_url' => 'https://bob.dev',
                'image' => 'profile_images/bob.png',
            ],
            [
                'name' => 'Charlie Davis',
                'email' => 'charlie@example.com',
                'password' => 'password',
                'bio' => 'Frontend developer with a knack for creating intuitive user interfaces.',
                'skills' => json_encode(['JavaScript', 'React', 'CSS']),
                'interests' => json_encode(['UI/UX Design', 'Web Accessibility']),
                'portfolio_url' => 'https://charlie.dev',
                'image' => 'profile_images/charlie.png',
            ],
            [
                'name' => 'Diana Prince',
                'email' => 'diana@example.com',
                'password' => 'password',
                'bio' => 'Superhero and justice advocate with a background in law.',
                'skills' => json_encode(['Leadership', 'Negotiation', 'Combat']),
                'interests' => json_encode(['Justice', 'Human Rights']),
                'portfolio_url' => 'https://diana.dev',
                'image' => 'profile_images/diana.png',
            ],
        ];

        foreach ($users as $user) {
            \App\Models\User::create($user);
        }
    }
}
