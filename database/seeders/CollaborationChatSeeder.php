<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CollaborationChatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $collaborationChats = [
            // Collaboration 1: Pengembangan Aplikasi Mobile untuk Pendidikan
            ['message' => 'Halo, saya punya pengalaman menggunakan Flutter dan tertarik bergabung dalam pengembangan aplikasi pendidikan ini.', 'collaboration_id' => 1, 'user_id' => 2],
            ['message' => 'Terima kasih! Kami sedang merancang fitur utama aplikasi, silakan share ide atau desain yang kamu punya.', 'collaboration_id' => 1, 'user_id' => 1],
            ['message' => 'Saya bisa membantu di bagian UI/UX, apakah sudah ada wireframe awal?', 'collaboration_id' => 1, 'user_id' => 3],

            // Collaboration 2: Proyek Penanaman Pohon di Area Perkotaan
            ['message' => 'Saya siap membantu dalam mengorganisir acara penanaman pohon. Apakah sudah ada lokasi yang ditentukan?', 'collaboration_id' => 2, 'user_id' => 4],
            ['message' => 'Lokasi sudah dipilih di taman kota. Kita butuh tim untuk promosi dan dokumentasi kegiatan.', 'collaboration_id' => 2, 'user_id' => 2],
            ['message' => 'Saya bisa bantu membuat materi promosi untuk media sosial.', 'collaboration_id' => 2, 'user_id' => 5],

            // Collaboration 3: Kampanye Kesadaran Kesehatan Mental
            ['message' => 'Saya tertarik membantu kampanye ini, terutama dalam pembuatan konten edukasi.', 'collaboration_id' => 3, 'user_id' => 1],
            ['message' => 'Terima kasih! Kita butuh desain grafis untuk poster dan infografis. Ada yang bisa membantu?', 'collaboration_id' => 3, 'user_id' => 3],
            ['message' => 'Saya bisa handle desain grafis dan juga promosi di media sosial.', 'collaboration_id' => 3, 'user_id' => 2],

            // Collaboration 4: Inisiatif Pengurangan Sampah Plastik
            ['message' => 'Saya punya ide untuk workshop edukasi pengurangan plastik di sekolah. Siapa yang bisa bantu koordinasi?', 'collaboration_id' => 4, 'user_id' => 5],
            ['message' => 'Saya bisa bantu menghubungi sekolah dan komunitas lokal.', 'collaboration_id' => 4, 'user_id' => 4],
            ['message' => 'Kita juga bisa buat kampanye online agar lebih banyak yang terlibat.', 'collaboration_id' => 4, 'user_id' => 1],

            // Collaboration 5: Pengembangan Platform E-Commerce Lokal
            ['message' => 'Saya developer Laravel, siap bantu backend platform e-commerce ini.', 'collaboration_id' => 5, 'user_id' => 2],
            ['message' => 'Terima kasih! Kita juga butuh frontend developer dan desainer web.', 'collaboration_id' => 5, 'user_id' => 1],
            ['message' => 'Saya bisa handle Vue.js dan desain web, mari diskusikan fitur utama yang ingin dikembangkan.', 'collaboration_id' => 5, 'user_id' => 3],
        ];

        foreach ($collaborationChats as $chat) {
            \App\Models\CollaborationChat::create($chat);
        }
    }
}