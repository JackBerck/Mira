<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ForumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $forums = [
            [
                'title' => 'Gerakan Bersama Mengurangi Sampah Plastik',
                'description' => 'Forum ini menjadi wadah kolaborasi bagi pengguna yang peduli terhadap isu sampah plastik. Diskusikan strategi pengurangan plastik, berbagi ide kampanye lingkungan, dan rancang aksi nyata seperti pengumpulan sampah, edukasi masyarakat, serta pengembangan produk ramah lingkungan. Bersama, kita dapat menciptakan perubahan signifikan untuk masa depan bumi yang lebih bersih.',
                'tags' => json_encode(['sampah plastik', 'lingkungan', 'kolaborasi']),
                'image' => null,
                'forum_category_id' => 1,
                'user_id' => 1,
            ],
            [
                'title' => 'Kolaborasi Digital untuk Edukasi Anak Daerah Terpencil',
                'description' => 'Topik ini mengajak pengguna untuk berkolaborasi dalam menciptakan solusi digital guna meningkatkan akses pendidikan di daerah terpencil. Diskusikan pengembangan platform pembelajaran daring, penggalangan donasi perangkat, hingga pelatihan guru lokal. Bersama, kita dapat memperluas kesempatan belajar bagi anak-anak yang membutuhkan.',
                'tags' => json_encode(['edukasi', 'daerah terpencil', 'digital']),
                'image' => null,
                'forum_category_id' => 2,
                'user_id' => 2,
            ],
            [
                'title' => 'Aksi Bersama Melawan Hoaks dan Disinformasi',
                'description' => 'Forum ini fokus pada upaya kolektif melawan penyebaran hoaks dan disinformasi di masyarakat. Diskusikan metode verifikasi informasi, edukasi literasi digital, serta pengembangan komunitas cek fakta. Kolaborasi antar pengguna sangat penting untuk menciptakan ekosistem informasi yang sehat dan terpercaya.',
                'tags' => json_encode(['hoaks', 'disinformasi', 'literasi digital']),
                'image' => null,
                'forum_category_id' => 3,
                'user_id' => 3,
            ],
            [
                'title' => 'Inisiatif Urban Farming untuk Ketahanan Pangan Kota',
                'description' => 'Diskusi terbuka bagi pengguna yang ingin berkolaborasi dalam mengembangkan urban farming di lingkungan perkotaan. Bagikan pengalaman, rancang proyek bersama, dan ajak komunitas untuk memulai pertanian kota sebagai solusi ketahanan pangan dan penghijauan lingkungan. Kolaborasi adalah kunci keberhasilan gerakan ini.',
                'tags' => json_encode(['urban farming', 'ketahanan pangan', 'kota']),
                'image' => null,
                'forum_category_id' => 4,
                'user_id' => 4,
            ],
            [
                'title' => 'Pengembangan Aplikasi Kesehatan Mental Berbasis Komunitas',
                'description' => 'Forum ini mengajak pengguna untuk berkolaborasi dalam merancang dan mengembangkan aplikasi kesehatan mental yang berbasis komunitas. Diskusikan fitur yang dibutuhkan, strategi pengembangan, serta cara membangun dukungan sosial bagi pengguna aplikasi. Bersama, kita dapat menciptakan ruang aman dan saling mendukung untuk kesehatan mental.',
                'tags' => json_encode(['kesehatan mental', 'aplikasi', 'komunitas']),
                'image' => null,
                'forum_category_id' => 5,
                'user_id' => 1,
            ],
        ];

        foreach ($forums as $forum) {
            \App\Models\Forum::create($forum);
        }
    }
}