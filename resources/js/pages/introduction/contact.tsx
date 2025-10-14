import ContactForm from '@/components/contact-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GuestLayout from '@/layouts/guest-layout';
import { Clock, Mail, MapPin, MessageCircle, Phone, Users } from 'lucide-react';

export default function Contact() {
    const contactMethods = [
        {
            icon: <Mail className="h-6 w-6" />,
            title: 'Email',
            description: 'Untuk pertanyaan umum dan dukungan',
            contact: 'support@mira.app',
            action: 'Kirim Email',
        },
        {
            icon: <Phone className="h-6 w-6" />,
            title: 'Telepon',
            description: 'Hubungi tim support kami',
            contact: '+62-811-0000-000',
            action: 'Telepon Sekarang',
        },
        {
            icon: <MessageCircle className="h-6 w-6" />,
            title: 'Live Chat',
            description: 'Chat langsung dengan customer service',
            contact: 'Online 24/7',
            action: 'Mulai Chat',
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: 'Community',
            description: 'Bergabung dengan forum komunitas',
            contact: '12K+ anggota aktif',
            action: 'Join Forum',
        },
    ];

    const officeHours = [
        { day: 'Senin - Jumat', time: '09:00 - 17:00 WIB' },
        { day: 'Sabtu', time: '09:00 - 15:00 WIB' },
        { day: 'Minggu', time: 'Closed' },
    ];

    return (
        <GuestLayout>
            <section className="section-padding-x py-24">
                <div className="container max-w-screen-xl">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                        Mari Terhubung dengan{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Tim Mira
                        </span>
                    </h1>

                    {/* Contact Methods Section */}
                    <div className="mb-12">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900">
                            Cara Menghubungi Kami
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {contactMethods.map((method, index) => (
                                <Card key={index} className="border-0 shadow-sm transition-shadow hover:shadow-md">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center">
                                            <div className="mr-3 rounded-lg bg-blue-100 p-2 text-blue-600">
                                                {method.icon}
                                            </div>
                                            <CardTitle className="text-lg">
                                                {method.title}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <p className="text-sm text-gray-600">
                                            {method.description}
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {method.contact}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid gap-12 lg:grid-cols-3">
                        {/* Contact Form - Takes 2/3 of space */}
                        <div className="lg:col-span-2">
                            <Card className="border-0 shadow-lg">
                                <CardHeader className="pb-6">
                                    <CardTitle className="text-2xl font-bold text-gray-900">
                                        Kirim Pesan
                                    </CardTitle>
                                    <p className="text-gray-600">
                                        Ceritakan bagaimana kami bisa membantu
                                        Anda. Tim kami akan merespons dalam 24
                                        jam.
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <ContactForm />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Information */}
                        <div className="space-y-6">
                            {/* Office Hours */}
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center text-lg">
                                        <Clock className="mr-2 h-5 w-5 text-blue-600" />
                                        Jam Operasional
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {officeHours.map((schedule, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between"
                                        >
                                            <span className="font-medium text-gray-700">
                                                {schedule.day}
                                            </span>
                                            <span className="text-gray-600">
                                                {schedule.time}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="border-t pt-3">
                                        <p className="text-sm text-blue-600">
                                            ⚡ Live chat tersedia 24/7
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* FAQ Quick Links */}
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">
                                        FAQ Populer
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-2">
                                        <a
                                            href="https://wa.me/62812123123"
                                            target='_blank'
                                            className="block text-sm font-medium text-blue-600 hover:text-blue-700"
                                        >
                                            → Bagaimana cara memulai kolaborasi?
                                        </a>
                                        <a
                                            href="https://wa.me/62812123123"
                                            target='_blank'
                                            className="block text-sm font-medium text-blue-600 hover:text-blue-700"
                                        >
                                            → Apakah AI Companion benar-benar
                                            gratis?
                                        </a>
                                        <a
                                            href="https://wa.me/62812123123"
                                            target='_blank'
                                            className="block text-sm font-medium text-blue-600 hover:text-blue-700"
                                        >
                                            → Bagaimana keamanan data dijamin?
                                        </a>
                                        <a
                                            href="https://wa.me/62812123123"
                                            target='_blank'
                                            className="block text-sm font-medium text-blue-600 hover:text-blue-700"
                                        >
                                            → Bisakah upgrade/downgrade plan
                                            kapan saja?
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Location */}
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center text-lg">
                                        <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                                        Lokasi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative mb-3 h-40 w-full overflow-hidden rounded-lg border">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7521.147553998742!2d109.33086394420211!3d-7.428722208339213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6559814ade5b79%3A0xaef1b7bab5cba0f0!2sFakultas%20Teknik%20Universitas%20Jenderal%20Soedirman!5e1!3m2!1sid!2sid!4v1760443872504!5m2!1sid!2sid"
                                            width="100%"
                                            height="100%"
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            className="rounded-lg"
                                        />
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p className="font-medium text-gray-900">
                                            Fakultas Teknik UNSOED
                                        </p>
                                        <p className="text-gray-600">
                                            Jl. Prof. DR. HR Bunyamin No.708,
                                            Grendeng, Purwokerto
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
