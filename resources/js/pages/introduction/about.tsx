import { Card, CardContent } from '@/components/ui/card';
import GuestLayout from '@/layouts/guest-layout';
import {
    Award,
    BookOpen,
    Globe,
    Heart,
    Sparkles,
    Target,
    Zap,
} from 'lucide-react';

export default function About() {
    const values = [
        {
            icon: <Heart className="h-8 w-8" />,
            title: 'Empati & Kolaborasi',
            description:
                'Kami percaya bahwa ide terbaik lahir dari pemahaman mendalam terhadap kebutuhan manusia dan kerjasama yang solid.',
        },
        {
            icon: <Zap className="h-8 w-8" />,
            title: 'Inovasi Berkelanjutan',
            description:
                'Mendorong kreativitas tanpa batas dengan teknologi AI yang memahami dan mengembangkan potensi setiap individu.',
        },
        {
            icon: <Globe className="h-8 w-8" />,
            title: 'Dampak Positif',
            description:
                'Setiap proyek yang lahir dari Mira bertujuan menciptakan perubahan positif untuk masyarakat dan lingkungan.',
        },
        {
            icon: <BookOpen className="h-8 w-8" />,
            title: 'Pembelajaran Berkelanjutan',
            description:
                'Memfasilitasi pertukaran pengetahuan dan pengalaman antar generasi untuk pertumbuhan bersama.',
        },
    ];

    return (
        <GuestLayout>
            {/* Hero Section */}
            <section className="section-padding-x bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16 md:pt-28 md:pb-24">
                <div className="container max-w-screen-xl">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-6 inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Tentang Mira
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
                            Membangun Masa Depan{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Bersama-sama
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl">
                            Mira lahir dari keyakinan bahwa setiap orang
                            memiliki potensi untuk menciptakan perubahan
                            positif. Kami menyediakan platform yang memungkinkan
                            ide-ide brilian berkembang menjadi solusi nyata
                            melalui kolaborasi yang bermakna.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section-padding-x bg-white py-16 md:py-24">
                <div className="container max-w-screen-xl">
                    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                        <div className="space-y-8">
                            <div>
                                <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                    <Target className="mr-2 h-4 w-4" />
                                    Misi Kami
                                </div>
                                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                                    Memberdayakan Setiap Ide untuk Menciptakan
                                    Dampak
                                </h2>
                                <p className="text-lg leading-relaxed text-gray-600">
                                    Mira hadir untuk menjembatani kesenjangan
                                    antara ide brilian dan eksekusi nyata. Kami
                                    percaya bahwa dengan teknologi AI yang tepat
                                    dan komunitas yang solid, setiap orang dapat
                                    mewujudkan visinya untuk dunia yang lebih
                                    baik.
                                </p>
                            </div>

                            <div>
                                <div className="mb-4 inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                                    <Award className="mr-2 h-4 w-4" />
                                    Visi Kami
                                </div>
                                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                                    Menjadi Platform Kolaborasi Terdepan di
                                    Dunia
                                </h2>
                                <p className="text-lg leading-relaxed text-gray-600">
                                    Kami memimpikan dunia di mana setiap ide
                                    mendapat kesempatan untuk berkembang, di
                                    mana kolaborasi lintas budaya dan disiplin
                                    menjadi norma, dan di mana teknologi
                                    benar-benar melayani kemanusiaan.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <Card className="border-blue-200 bg-blue-50">
                                        <CardContent className="p-6 text-center">
                                            <div className="text-3xl font-bold text-blue-600">
                                                5K+
                                            </div>
                                            <div className="text-sm text-blue-700">
                                                Ide Dikembangkan
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-purple-200 bg-purple-50">
                                        <CardContent className="p-6 text-center">
                                            <div className="text-3xl font-bold text-purple-600">
                                                890+
                                            </div>
                                            <div className="text-sm text-purple-700">
                                                Proyek Terealisasi
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="mt-8 space-y-4">
                                    <Card className="border-pink-200 bg-pink-50">
                                        <CardContent className="p-6 text-center">
                                            <div className="text-3xl font-bold text-pink-600">
                                                12K+
                                            </div>
                                            <div className="text-sm text-pink-700">
                                                Anggota Aktif
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-green-200 bg-green-50">
                                        <CardContent className="p-6 text-center">
                                            <div className="text-3xl font-bold text-green-600">
                                                150+
                                            </div>
                                            <div className="text-sm text-green-700">
                                                Startup Lahir
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section-padding-x bg-gray-50 py-16 md:py-24">
                <div className="container max-w-screen-xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                            Nilai-nilai yang Kami Junjung
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Prinsip-prinsip fundamental yang mendasari setiap
                            keputusan dan inovasi yang kami lakukan
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {values.map((value, index) => (
                            <Card
                                key={index}
                                className="group border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                                        {value.icon}
                                    </div>
                                    <h3 className="mb-3 text-xl font-semibold text-gray-900">
                                        {value.title}
                                    </h3>
                                    <p className="leading-relaxed text-gray-600">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
