<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ForumCommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $forumComments = [
            // Forum 1: Gerakan Bersama Mengurangi Sampah Plastik
            [
                'content' => 'Saya sudah mulai mengurangi penggunaan plastik sekali pakai di rumah. Mungkin kita bisa membuat kampanye edukasi di sekolah-sekolah agar anak-anak lebih sadar akan bahaya sampah plastik.',
                'forum_id' => 1,
                'user_id' => 2,
            ],
            [
                'content' => 'Ide pengumpulan sampah plastik sangat bagus! Saya bersedia menjadi relawan untuk kegiatan pengumpulan di lingkungan saya. Apakah ada jadwal atau koordinasi khusus?',
                'forum_id' => 1,
                'user_id' => 3,
            ],
            [
                'content' => 'Saya punya ide untuk membuat produk daur ulang dari sampah plastik, seperti tas atau dompet. Siapa yang tertarik untuk berkolaborasi dalam pengembangan produk ini?',
                'forum_id' => 1,
                'user_id' => 4,
            ],
            [
                'content' => 'Kita juga bisa bekerja sama dengan toko-toko lokal untuk menyediakan alternatif kemasan ramah lingkungan. Saya punya beberapa kontak yang bisa dihubungi.',
                'forum_id' => 1,
                'user_id' => 5,
            ],

            // Forum 2: Kolaborasi Digital untuk Edukasi Anak Daerah Terpencil
            [
                'content' => 'Saya pernah mengajar di daerah terpencil dan akses internet memang sangat terbatas. Mungkin kita bisa mulai dengan penggalangan donasi perangkat belajar seperti tablet atau laptop.',
                'forum_id' => 2,
                'user_id' => 1,
            ],
            [
                'content' => 'Bagaimana jika kita membuat modul pembelajaran offline yang bisa diakses tanpa internet? Saya bisa membantu dalam pembuatan konten edukasi.',
                'forum_id' => 2,
                'user_id' => 3,
            ],
            [
                'content' => 'Saya tertarik untuk melatih guru lokal agar mereka bisa memanfaatkan teknologi dalam proses belajar mengajar. Ada yang punya pengalaman pelatihan serupa?',
                'forum_id' => 2,
                'user_id' => 4,
            ],
            [
                'content' => 'Platform pembelajaran daring sangat membantu, tapi kita juga perlu memastikan anak-anak memiliki motivasi belajar. Mungkin bisa dibuat program mentoring online.',
                'forum_id' => 2,
                'user_id' => 5,
            ],

            // Forum 3: Aksi Bersama Melawan Hoaks dan Disinformasi
            [
                'content' => 'Saya sering menemukan berita hoaks di media sosial. Kita bisa membuat komunitas cek fakta yang aktif membagikan klarifikasi informasi kepada masyarakat.',
                'forum_id' => 3,
                'user_id' => 2,
            ],
            [
                'content' => 'Literasi digital sangat penting. Saya bersedia membuat materi edukasi tentang cara mengenali berita palsu dan membagikannya di forum ini.',
                'forum_id' => 3,
                'user_id' => 3,
            ],
            [
                'content' => 'Bagaimana jika kita mengadakan webinar rutin tentang verifikasi informasi? Saya bisa membantu sebagai moderator.',
                'forum_id' => 3,
                'user_id' => 1,
            ],
            [
                'content' => 'Saya punya pengalaman dalam pengembangan aplikasi cek fakta. Jika ada yang tertarik, kita bisa diskusikan fitur yang dibutuhkan.',
                'forum_id' => 3,
                'user_id' => 4,
            ],

            // Forum 4: Inisiatif Urban Farming untuk Ketahanan Pangan Kota
            [
                'content' => 'Saya sudah memulai urban farming di halaman rumah. Hasilnya lumayan untuk konsumsi sendiri. Mungkin kita bisa buat workshop untuk warga sekitar.',
                'forum_id' => 4,
                'user_id' => 2,
            ],
            [
                'content' => 'Saya tertarik untuk berkolaborasi dalam proyek pertanian kota. Apakah ada komunitas yang sudah berjalan dan bisa saya ikuti?',
                'forum_id' => 4,
                'user_id' => 3,
            ],
            [
                'content' => 'Urban farming bisa menjadi solusi ketahanan pangan. Saya punya beberapa desain kebun vertikal yang bisa diimplementasikan di lahan sempit.',
                'forum_id' => 4,
                'user_id' => 5,
            ],
            [
                'content' => 'Kita juga bisa mengajak sekolah-sekolah untuk membuat kebun mini sebagai bagian dari edukasi lingkungan.',
                'forum_id' => 4,
                'user_id' => 1,
            ],

            // Forum 5: Pengembangan Aplikasi Kesehatan Mental Berbasis Komunitas
            [
                'content' => 'Saya merasa aplikasi kesehatan mental sangat dibutuhkan, terutama untuk remaja. Fitur komunitas diskusi dan konsultasi anonim bisa sangat membantu.',
                'forum_id' => 5,
                'user_id' => 2,
            ],
            [
                'content' => 'Saya punya pengalaman sebagai konselor. Saya bersedia menjadi bagian dari tim pengembangan konten edukasi dan dukungan psikologis.',
                'forum_id' => 5,
                'user_id' => 3,
            ],
            [
                'content' => 'Aplikasi ini sebaiknya memiliki fitur pelaporan jika ada pengguna yang membutuhkan bantuan darurat. Saya bisa membantu dalam perancangan sistem tersebut.',
                'forum_id' => 5,
                'user_id' => 4,
            ],
            [
                'content' => 'Saya tertarik untuk mengembangkan fitur komunitas berbasis minat agar pengguna bisa saling mendukung sesuai kebutuhan mereka.',
                'forum_id' => 5,
                'user_id' => 5,
            ],
        ];

        foreach ($forumComments as $comment) {
            \App\Models\ForumComment::create($comment);
        }
    }
}