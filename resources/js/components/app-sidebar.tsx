import { Separator } from '@/components/ui/separator';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Brain,
    BriefcaseBusiness,
    Home,
    TrendingUp,
    Users,
    MessageSquareMore
} from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: '/beranda',
        icon: Home,
    },
    {
        title: 'Forum',
        href: '/forum',
        icon: Users,
    },
    {
        title: 'Kolaborasi',
        href: '/kolaborasi',
        icon: BriefcaseBusiness,
    },
    {
        title: 'Mari Berpikir',
        href: '/mari-berpikir',
        icon: Brain,
    },
    {
        title: 'Pesan',
        href: '/pesan',
        icon: MessageSquareMore
    }
];

const discoverNavItems: NavItem[] = [
    {
        title: 'Trending',
        href: '/trending',
        icon: TrendingUp,
    },
    {
        title: 'Following',
        href: '/following',
        icon: Users,
    },
];

export function AppSidebar() {
    const { url } = usePage();

    // Check if current path matches nav item
    const isActive = (href: string) => {
        return url.startsWith(href);
    };

    return (
        <Sidebar collapsible="icon" variant="sidebar" className="border-r">
            {/* Header with Logo */}
            <SidebarHeader className="flex h-14 items-center justify-start border-b px-4">
                <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 transition-opacity group-data-[collapsible=icon]:justify-center md:hidden"
                >
                    <img
                        src="/img/logos/mira-black.png"
                        alt="Mira"
                        className="h-8 w-auto"
                    />
                </Link>
            </SidebarHeader>

            <SidebarContent className="py-4">
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={isActive(item.href)}
                                        className="rounded-md transition-colors hover:bg-gray-100 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700 dark:hover:bg-gray-800 dark:data-[active=true]:bg-blue-900 dark:data-[active=true]:text-blue-300"
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="h-5 w-5" />
                                            <span className="font-normal">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <Separator className="my-4" />

                {/* Discover Section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="px-2 text-xs text-gray-500 uppercase dark:text-gray-400">
                        Discover
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {discoverNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={isActive(item.href)}
                                        className="rounded-md transition-colors hover:bg-gray-100 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700 dark:hover:bg-gray-800 dark:data-[active=true]:bg-blue-900 dark:data-[active=true]:text-blue-300"
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="h-5 w-5" />
                                            <span className="font-normal">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
