<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'user']);

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
            [
                'name' => 'Ethan Hunt',
                'email' => 'ethan@example.com',
                'password' => 'password',
                'bio' => 'Secret agent with a flair for espionage and a love for technology.',
                'skills' => json_encode(['Stealth', 'Hacking', 'Martial Arts']),
                'interests' => json_encode(['Espionage', 'Technology']),
                'portfolio_url' => 'https://ethan.dev',
                'image' => 'profile_images/ethan.png',
            ],
            [
                'name' => 'Fiona Glenanne',
                'email' => 'fiona@example.com',
                'password' => 'password',
                'bio' => 'Ex-IRA operative turned housewife with a talent for improvisation.',
                'skills' => json_encode(['Strategy', 'Negotiation', 'Combat']),
                'interests' => json_encode(['Cooking', 'Gardening']),
                'portfolio_url' => 'https://fiona.dev',
                'image' => 'profile_images/fiona.png',
            ],
        ];

        foreach ($users as $user) {
            $new = User::create($user);
            $new->assignRole('user');
        }

        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'email_verified_at' => Carbon::now(),
        ]);

        $admin->assignRole('admin');
    }
}
