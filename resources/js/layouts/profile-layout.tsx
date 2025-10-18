import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    Briefcase,
    Heart,
    LogOut,
    MessageCircle,
    MessageSquare,
    User,
    UserCheck,
    Users,
} from 'lucide-react';
import { type ReactNode } from 'react';

interface ProfileLayoutProps {
    children: ReactNode;
    title: string;
}

const profileNavItems = [
    {
        title: 'Kelola Akun',
        href: '/profile',
        icon: User,
        description: 'Informasi dasar dan pengaturan akun',
    },
    {
        title: 'Keahlian & Minat',
        href: '/profile/skills-interests',
        icon: Award,
        description: 'Skills, interests, dan expertise area',
    },
    {
        title: 'Portfolio',
        href: '/profile/portfolio',
        icon: Briefcase,
        description: 'Showcase karya dan pencapaian',
    },
];

const activityNavItems = [
    {
        title: 'Forum Saya',
        href: '/profile/my-forums',
        icon: MessageSquare,
        // count: 12,
    },
    {
        title: 'Kolaborasi Saya',
        href: '/profile/my-collaborations',
        icon: Users,
        // count: 5,
    },
    {
        title: 'Forum Disukai',
        href: '/profile/liked-forums',
        icon: Heart,
        // count: 34,
    },
    {
        title: 'Forum Dikomentari',
        href: '/profile/commented-forums',
        icon: MessageCircle,
        // count: 18,
    },
    {
        title: 'Kolaborasi Diikuti',
        href: '/profile/followed-collaborations',
        icon: UserCheck,
        // count: 8,
    },
];

export default function ProfileLayout({ children }: ProfileLayoutProps) {
    const { url } = usePage();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { auth } = usePage().props as any;
    const user = auth?.user;

    const isActive = (href: string) => {
        if (href === '/profile') {
            return url === '/profile';
        }
        return url.startsWith(href);
    };

    return (
        <AppLayout>
            <div className="container max-w-screen-xl py-6">
                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 space-y-6">
                            {/* Profile Card */}
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-6 text-center">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-2xl font-bold text-white">
                                        <Avatar className="h-full w-full">
                                            <AvatarImage
                                                src={`/storage/${user.avatar}`}
                                                alt="Profile"
                                                className="h-full w-full object-cover"
                                            />
                                            <AvatarFallback className="bg-transparent">
                                                {user.name
                                                    .split(' ')
                                                    .map((n: string) => n[0])
                                                    .join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <h3 className="mb-1 font-semibold text-gray-900">
                                        {user?.name || 'User'}
                                    </h3>
                                    <p className="mb-4 text-sm text-gray-600">
                                        {user?.email}
                                    </p>
                                    {user?.bio && (
                                        <p className="text-sm leading-relaxed text-gray-700">
                                            {user.bio}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Navigation */}
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-4">
                                    <div className="space-y-1">
                                        <h4 className="px-3 py-2 text-sm font-medium text-gray-900">
                                            Pengaturan Profile
                                        </h4>
                                        {profileNavItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${
                                                    isActive(item.href)
                                                        ? 'bg-blue-50 font-medium text-blue-700'
                                                        : 'text-gray-700'
                                                }`}
                                            >
                                                <item.icon className="h-4 w-4" />
                                                <div className="flex-1">
                                                    <div>{item.title}</div>
                                                    <div className="mt-0.5 text-xs text-gray-500">
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="space-y-1">
                                        <h4 className="px-3 py-2 text-sm font-medium text-gray-900">
                                            Aktivitas Saya
                                        </h4>
                                        {activityNavItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${
                                                    isActive(item.href)
                                                        ? 'bg-blue-50 font-medium text-blue-700'
                                                        : 'text-gray-700'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </div>
                                                {/* <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                                                    {item.count}
                                                </span> */}
                                            </Link>
                                        ))}
                                    </div>

                                    <Separator className="my-4" />

                                    {/* Logout */}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Keluar</span>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">{children}</div>
                </div>
            </div>
        </AppLayout>
    );
}
