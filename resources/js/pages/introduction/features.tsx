import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GuestLayout from '@/layouts/guest-layout';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Brain,
    Check,
    MessageCircle,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useState } from 'react';

export default function Features() {
    const [activeDemo, setActiveDemo] = useState('ai-companion');

    const mainFeatures = [
        {
            id: 'ai-companion',
            icon: <Brain className="h-12 w-12" />,
            title: 'AI Companion - Mira',
            subtitle: 'Your Intelligent Idea Partner',
            description:
                'AI companion yang memahami visi Anda dan membantu mengembangkan ide dari konsep hingga eksekusi nyata.',
            features: [
                'Brainstorming interaktif dengan AI',
                'Analisis kelayakan ide otomatis',
                'Saran strategi implementasi',
                'Rekomendasi kolaborator potensial',
            ],
            demo: 'Chat dengan AI untuk mengembangkan ide aplikasi edtech...',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            id: 'forum',
            icon: <MessageCircle className="h-12 w-12" />,
            title: 'Forum Diskusi',
            subtitle: 'Community-Driven Conversations',
            description:
                'Platform diskusi yang memfasilitasi pertukaran ide, feedback konstruktif, dan networking berkualitas.',
            features: [
                'Diskusi terstruktur by kategori',
                'System voting dan reputation',
                'Real-time notifications',
                'Advanced search & filtering',
            ],
            demo: 'Diskusi trending: "Sustainable Tech untuk UMKM"',
            color: 'from-green-500 to-emerald-500',
        },
        {
            id: 'collaboration',
            icon: <Users className="h-12 w-12" />,
            title: 'Kolaborasi Proyek',
            subtitle: 'Build Teams, Create Impact',
            description:
                'Platform komprehensif untuk membentuk tim, mengelola proyek, dan mewujudkan ide bersama-sama.',
            features: [
                'Project matching algorithm',
                'Skill-based team formation',
                'Milestone tracking system',
                'Integrated communication tools',
            ],
            demo: 'Proyek aktif: "EcoWaste - Smart Waste Management"',
            color: 'from-purple-500 to-pink-500',
        },
        {
            id: 'analytics',
            icon: <TrendingUp className="h-12 w-12" />,
            title: 'Analytics & Insights',
            subtitle: 'Data-Driven Decision Making',
            description:
                'Analisis mendalam tentang trend, performa ide, dan peluang kolaborasi untuk memaksimalkan dampak.',
            features: [
                'Idea performance metrics',
                'Community engagement analytics',
                'Trend forecasting',
                'Success probability scoring',
            ],
            demo: 'Dashboard showing: 78% success rate for your idea category',
            color: 'from-orange-500 to-red-500',
        },
    ];

    return (
        <GuestLayout>
            {/* Main Features Section */}
            <section className="section-padding-x bg-white py-24">
                <div className="container max-w-screen-xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                            Fitur Utama yang Memberdayakan
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Setiap fitur dirancang untuk memaksimalkan potensi
                            kolaborasi dan inovasi Anda
                        </p>
                    </div>

                    <Tabs
                        value={activeDemo}
                        onValueChange={setActiveDemo}
                        className="w-full"
                    >
                        <TabsList className="mb-12 grid w-full gap-4 grid-cols-2 md:grid-cols-4 bg-transparent">
                            {mainFeatures.map((feature) => (
                                <TabsTrigger
                                    key={feature.id}
                                    value={feature.id}
                                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                                >
                                    <span className="hidden sm:inline">
                                        {feature.title}
                                    </span>
                                    <span className="sm:hidden">
                                        {feature.icon}
                                    </span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {mainFeatures.map((feature) => (
                            <TabsContent key={feature.id} value={feature.id}>
                                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                                    <div className="space-y-6">
                                        <div
                                            className={`inline-flex h-16 w-16 items-center justify-center bg-gradient-to-r ${feature.color} rounded-2xl text-white`}
                                        >
                                            {feature.icon}
                                        </div>

                                        <div>
                                            <h3 className="mb-2 text-3xl font-bold text-gray-900">
                                                {feature.title}
                                            </h3>
                                            <p className="mb-4 font-semibold text-blue-600">
                                                {feature.subtitle}
                                            </p>
                                            <p className="text-lg leading-relaxed text-gray-600">
                                                {feature.description}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            {feature.features.map(
                                                (item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center space-x-3"
                                                    >
                                                        <Check className="h-5 w-5 text-green-500" />
                                                        <span className="text-gray-700">
                                                            {item}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>

                                        <Button className="group" asChild>
                                            <Link href="/register">
                                                Mulai Menggunakan
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </div>

                                    <div className="relative">
                                        <Card className="border-0 bg-gray-50 shadow-lg">
                                            <CardHeader className="pb-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div
                                                    className={`bg-gradient-to-r ${feature.color} rounded-lg p-6 text-white`}
                                                >
                                                    <div className="mb-4 flex items-center space-x-3">
                                                        {feature.icon}
                                                        <div>
                                                            <h4 className="font-semibold">
                                                                {feature.title}
                                                            </h4>
                                                            <p className="text-sm opacity-90">
                                                                Live Demo
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm opacity-90">
                                                        {feature.demo}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </section>
        </GuestLayout>
    );
}
