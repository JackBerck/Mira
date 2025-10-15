/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/components/ui/sidebar';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Bookmark,
    ChevronDown,
    Edit3,
    LogOut,
    Menu,
    MessageCircle,
    Search,
    Settings,
    TrendingUp,
    User,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';

export function TopNavbar() {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    // Sidebar controls
    const { toggleSidebar, state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/search', { q: searchQuery });
        }
    };

    // Quick actions in search
    const searchSuggestions = [
        { label: 'Trending Topics', icon: TrendingUp, href: '/trending' },
        { label: 'Recent Discussions', icon: MessageCircle, href: '/forum' },
        { label: 'Active Collaborations', icon: User, href: '/kolaborasi' },
    ];

    // Get user initials
    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="section-padding-x sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-xl items-center justify-between">
                {/* Hamburger Menu & Logo Section */}
                <div className="flex items-center gap-3">
                    {/* Hamburger Menu Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSidebar}
                        className="h-9 w-9 p-0"
                    >
                        {isCollapsed ? (
                            <Menu className="h-5 w-5" />
                        ) : (
                            <X className="h-5 w-5" />
                        )}
                        <span className="sr-only">Toggle sidebar</span>
                    </Button>

                    {/* Logo - Show when sidebar is collapsed or on mobile */}
                    <Link
                        href="/dashboard"
                        className="hidden items-center space-x-2 lg:flex"
                    >
                        <img
                            src="/img/logos/mira-black.png"
                            alt="Mira"
                            className="h-8 w-auto"
                        />
                    </Link>
                </div>

                {/* Search Bar - Medium Style */}
                <div className="relative mx-4 w-full md:max-w-sm lg:max-w-md">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            ref={searchRef}
                            type="search"
                            placeholder="Search forums, ideas, collaborations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() =>
                                setTimeout(() => setIsSearchFocused(false), 200)
                            }
                            className="border-0 bg-muted/50 pr-4 pl-9 transition-all focus:bg-background focus:ring-2 focus:ring-primary/20"
                        />
                    </form>

                    {/* Search Dropdown */}
                    {isSearchFocused && (
                        <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border border-border bg-background shadow-lg">
                            <div className="p-2">
                                {searchQuery ? (
                                    <div className="space-y-1">
                                        <div className="px-3 py-2 text-sm text-muted-foreground">
                                            Search for "{searchQuery}"
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                router.get('/search', {
                                                    q: searchQuery,
                                                    type: 'all',
                                                });
                                                setIsSearchFocused(false);
                                            }}
                                        >
                                            <Search className="mr-2 h-4 w-4" />
                                            Search everything
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                router.get('/search', {
                                                    q: searchQuery,
                                                    type: 'forums',
                                                });
                                                setIsSearchFocused(false);
                                            }}
                                        >
                                            <MessageCircle className="mr-2 h-4 w-4" />
                                            Search in forums
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                router.get('/search', {
                                                    q: searchQuery,
                                                    type: 'collaborations',
                                                });
                                                setIsSearchFocused(false);
                                            }}
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            Search collaborations
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                                            Quick Access
                                        </div>
                                        {searchSuggestions.map((item) => (
                                            <Button
                                                key={item.href}
                                                variant="ghost"
                                                className="w-full justify-start"
                                                onClick={() => {
                                                    router.get(item.href);
                                                    setIsSearchFocused(false);
                                                }}
                                            >
                                                <item.icon className="mr-2 h-4 w-4" />
                                                {item.label}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-2">
                    {/* Write Button */}
                    <Link href="/write">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hidden sm:flex"
                        >
                            <Edit3 className="mr-2 h-4 w-4" />
                            Buka Forum
                        </Button>
                    </Link>

                    {/* Notifications */}
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="relative"
                            >
                                <Bell className="h-5 w-5" />
                                {notifications?.unread_count > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
                                    >
                                        {notifications.unread_count > 9
                                            ? '9+'
                                            : notifications.unread_count}
                                    </Badge>
                                )}
                                <span className="sr-only">Notifications</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel className="flex items-center justify-between">
                                Notifications
                                {notifications?.unread_count > 0 && (
                                    <Badge variant="secondary" className="ml-2">
                                        {notifications.unread_count} new
                                    </Badge>
                                )}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {notifications?.recent?.length > 0 ? (
                                <>
                                    {notifications.recent.map(
                                        (notification: any) => (
                                            <DropdownMenuItem
                                                key={notification.id}
                                                className="flex flex-col items-start space-y-1 p-3"
                                            >
                                                <div className="flex w-full items-center space-x-2">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>
                                                    </div>
                                                    {!notification.read_at && (
                                                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {
                                                        notification.created_at_human
                                                    }
                                                </p>
                                            </DropdownMenuItem>
                                        ),
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/notifications"
                                            className="w-full text-center"
                                        >
                                            View all notifications
                                        </Link>
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <DropdownMenuItem disabled>
                                    <div className="flex flex-col items-center py-4">
                                        <Bell className="mb-2 h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            No new notifications
                                        </p>
                                    </div>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu> */}

                    {/* Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-9 w-9 rounded-full"
                            >
                                <Avatar className="h-9 w-9">
                                    <AvatarImage
                                        src={user?.avatar_url}
                                        alt={user?.name || 'User'}
                                    />
                                    <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
                                        {getUserInitials(user?.name || 'User')}
                                    </AvatarFallback>
                                </Avatar>
                                <ChevronDown className="absolute -right-0.5 -bottom-0.5 h-3 w-3 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-56"
                            align="end"
                            forceMount
                        >
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm leading-none font-medium">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Profile Actions */}
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/profil"
                                    className="cursor-pointer"
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link
                                    href="/bookmarks"
                                    className="cursor-pointer"
                                >
                                    <Bookmark className="mr-2 h-4 w-4" />
                                    <span>Bookmarks</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link
                                    href="/settings"
                                    className="cursor-pointer"
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Write Actions */}
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/write/forum"
                                    className="cursor-pointer"
                                >
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    <span>New Forum Post</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link
                                    href="/write/collaboration"
                                    className="cursor-pointer"
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Start Collaboration</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Logout */}
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="w-full cursor-pointer text-red-600"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
