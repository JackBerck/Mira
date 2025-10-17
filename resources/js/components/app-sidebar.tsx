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
import { Badge } from '@/components/ui/badge';
// import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Brain,
    // BriefcaseBusiness,
    Home,
    TrendingUp,
    Users,
    MessageSquareMore,
    BellDot,
    BriefcaseBusiness
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
    },
    {
        title: 'Notifikasi',
        href: '/notifikasi',
        icon: BellDot
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
    const { url, props } = usePage();
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    // Check if current path matches nav item
    const isActive = (href: string) => {
        return url.startsWith(href);
    };

    // Fetch unread notification count
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await axios.get('/notifikasi/unread-count');
                setUnreadCount(response.data.count);
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        if (props.auth) {
            fetchUnreadCount();
            // Refresh every 30 seconds
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [props.auth]);

    // Fetch unread messages count
    useEffect(() => {
        const fetchUnreadMessages = async () => {
            try {
                const response = await axios.get('/pesan/total-unread-count');
                setUnreadMessagesCount(response.data.count);
            } catch (error) {
                console.error('Error fetching unread messages:', error);
            }
        };

        if (props.auth) {
            fetchUnreadMessages();
            // Refresh every 10 seconds
            const interval = setInterval(fetchUnreadMessages, 10000);
            return () => clearInterval(interval);
        }
    }, [props.auth]);

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
                                            {item.href === '/notifikasi' && unreadCount > 0 && (
                                                <Badge variant="destructive" className="ml-auto h-5 min-w-5 rounded-full px-1 text-xs">
                                                    {unreadCount > 99 ? '99+' : unreadCount}
                                                </Badge>
                                            )}
                                            {item.href === '/pesan' && unreadMessagesCount > 0 && (
                                                <Badge variant="destructive" className="ml-auto h-5 min-w-5 rounded-full px-1 text-xs">
                                                    {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                                                </Badge>
                                            )}
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
