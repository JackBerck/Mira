<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CollaborationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $collaborations = [
            [
                'title' => 'Pengembangan Aplikasi Mobile untuk Pendidikan',
                'slug' => 'pengembangan-aplikasi-mobile-untuk-pendidikan',
                'description' => 'Kami mencari kolaborator untuk mengembangkan aplikasi mobile yang dapat membantu proses pembelajaran di sekolah.',
                'skills_needed' => json_encode(['Flutter', 'Dart', 'UI/UX Design']),
                'status' => 'open',
                'image' => null,
                'forum_category_id' => 1,
                'user_id' => 1,
            ],
            [
                'title' => 'Proyek Penanaman Pohon di Area Perkotaan',
                'slug' => 'proyek-penanaman-pohon-di-area-perkotaan',
                'description' => 'Bergabunglah dengan kami dalam proyek penanaman pohon untuk meningkatkan kualitas udara dan lingkungan di kota kita.',
                'skills_needed' => json_encode(['Organisasi Acara', 'Komunikasi', 'Pemasaran']),
                'status' => 'open',
                'image' => null,
                'forum_category_id' => 4,
                'user_id' => 2,
            ],
            [
                'title' => 'Kampanye Kesadaran Kesehatan Mental',
                'slug' => 'kampanye-kesadaran-kesehatan-mental',
                'description' => 'Kami mencari individu yang bersemangat untuk membantu kami dalam kampanye kesadaran kesehatan mental di komunitas kita.',
                'skills_needed' => json_encode(['Media Sosial', 'Desain Grafis', 'Penulisan Konten']),
                'status' => 'open',
                'image' => null,
                'forum_category_id' => 5,
                'user_id' => 3,
            ],
            [
                'title' => 'Inisiatif Pengurangan Sampah Plastik',
                'slug' => 'inisiatif-pengurangan-sampah-plastik',
                'description' => 'Mari bersama-sama mengurangi penggunaan plastik sekali pakai melalui berbagai inisiatif dan kampanye di komunitas kita.',
                'skills_needed' => json_encode(['Edukasi', 'Kampanye Sosial', 'Pengorganisasian Komunitas']),
                'status' => 'open',
                'image' => null,
                'forum_category_id' => 4,
                'user_id' => 4,
            ],
            [
                'title' => 'Pengembangan Platform E-Commerce Lokal',
                'slug' => 'pengembangan-platform-e-commerce-lokal',
                'description' => 'Kami mencari pengembang dan desainer untuk membantu kami membangun platform e-commerce yang mendukung bisnis lokal.',
                'skills_needed' => json_encode(['Laravel', 'Vue.js', 'Desain Web']),
                'status' => 'open',
                'image' => null,
                'forum_category_id' => 6,
                'user_id' => 1,
            ],
        ];

        foreach ($collaborations as $collaboration) {
            \App\Models\Collaboration::create($collaboration);
        }
    }
}
