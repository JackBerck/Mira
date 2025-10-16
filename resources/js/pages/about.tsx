import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AboutSection() {
    return (
        <section id="tentang" className="container mx-auto px-4 py-12 md:py-16">
            <header className="mx-auto max-w-3xl text-center">
                <h2 className="text-2xl font-semibold text-balance md:text-3xl">
                    Tentang Mira
                </h2>
                <p className="mt-3 text-pretty text-muted-foreground">
                    {'Mira — Where Wonder Meets Collaboration.'} Ketika rasa
                    ingin tahu bertemu dengan kolaborasi.
                </p>
            </header>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
                <div>
                    <h3 className="text-xl font-semibold">Latar Belakang</h3>
                    <p className="mt-2 text-muted-foreground">
                        Di tengah perkembangan digital dan minat terhadap
                        teknologi kreatif, dibutuhkan ruang kolaboratif yang
                        bukan hanya tempat berkomunikasi, namun juga berproses
                        dan bertumbuh bersama. Mira hadir untuk menjaga ide-ide
                        kecil agar tidak hilang dan menuntunnya hingga menjadi
                        aksi nyata.
                    </p>
                    <h4 className="mt-6 text-lg font-medium">
                        Permasalahan Utama
                    </h4>
                    <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
                        <li>
                            Kolaborasi ide terhambat karena kurangnya wadah yang
                            mempertemukan visi serupa.
                        </li>
                        <li>
                            Forum konvensional kurang interaktif dan mendorong
                            keterlibatan jangka panjang.
                        </li>
                        <li>
                            Minim fasilitasi proses inovasi dari konsep ke
                            realisasi.
                        </li>
                        <li>Fragmentasi komunitas di banyak platform.</li>
                    </ul>
                </div>
                <div className="relative">
                    <img
                        src={
                            '/img/placeholder.png?height=400&width=600&query=ruang%20kolaborasi%20tenang'
                        }
                        alt="Ilustrasi ruang kolaborasi yang tenang dan fokus"
                        className="h-auto w-full rounded-lg border object-cover"
                    />
                </div>
            </div>

            <div className="mt-12">
                <h3 className="text-xl font-semibold">Solusi & Keunikan</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            t: 'Forum Dinamis & Tematik',
                            d: 'Diskusi per kategori yang dapat berkembang menjadi project rooms.',
                        },
                        {
                            t: 'AI Idea Companion',
                            d: 'Insight otomatis: kelayakan, saran, dan referensi topik.',
                        },
                        {
                            t: 'Kolaborasi Adaptif',
                            d: 'Matchmaking berdasarkan minat dan keahlian.',
                        },
                        {
                            t: 'Journey-Based Collaboration',
                            d: 'Menuntun ide dari percakapan hingga realisasi.',
                        },
                    ].map((x) => (
                        <Card key={x.t}>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {x.t}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {x.d}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="mt-12">
                <h3 className="text-xl font-semibold">Nilai yang Kami Jaga</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {[
                        {
                            t: 'Kesederhanaan',
                            d: 'UI/UX bersih dan tenang, fokus pada konten dan kolaborasi.',
                        },
                        {
                            t: 'Keterbukaan',
                            d: 'Berbagi ide tanpa takut salah—semua berhak bereksplorasi.',
                        },
                        {
                            t: 'Pertumbuhan',
                            d: 'Mendorong proses belajar bersama menuju dampak nyata.',
                        },
                    ].map((x) => (
                        <Card key={x.t}>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {x.t}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {x.d}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="mt-12">
                <h3 className="text-xl font-semibold">
                    Perjalanan Ide di Mira
                </h3>
                <ol className="mt-4 grid gap-4 md:grid-cols-4">
                    {[
                        {
                            t: '1. Tulis Ide',
                            d: 'Mulai dari pemikiran singkat atau masalah yang ingin dipecahkan.',
                        },
                        {
                            t: '2. Dapatkan Insight',
                            d: 'AI Companion membantu menilai dan memperkaya ide.',
                        },
                        {
                            t: '3. Bentuk Tim',
                            d: 'Kolaborasi adaptif menemukan rekan yang tepat.',
                        },
                        {
                            t: '4. Wujudkan',
                            d: 'Project room: chat, task board, timeline.',
                        },
                    ].map((s) => (
                        <Card key={s.t}>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {s.t}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {s.d}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </ol>
            </div>
        </section>
    );
}
