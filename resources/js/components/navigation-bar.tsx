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
import { navigation } from '@/data/navigation';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export function NavigationBar() {
    const { props } = usePage<{ auth: { user?: User } }>();
    const user = props.auth?.user;

    const pathname =
        typeof window !== 'undefined' ? window.location.pathname : '';

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="section-padding-x sticky top-0 z-50 border-b bg-background/80 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto flex max-w-screen-xl items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="rounded-md border px-2 py-1 text-sm font-medium tracking-wide">
                        Mira
                    </span>
                    <span className="sr-only">
                        Mira — Where Wonder Meets Collaboration
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-4 md:flex">
                    {navigation.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                'text-sm text-muted-foreground transition-colors hover:text-foreground',
                                pathname === item.href && 'text-foreground',
                            )}
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>

                {/* Desktop User Menu */}
                {user ? (
                    <div className="hidden items-center gap-2 md:flex">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-8 w-8 rounded-full"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={`/storage/${user.avatar_url}`}
                                            alt={user.name}
                                        />
                                        <AvatarFallback>
                                            {user.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm leading-none font-medium">
                                            {user.name}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">Profil</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/forum">Buka Forum</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/collaboration">
                                        Buka Kolaborasi
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="w-full bg-red-600 text-left text-slate-50"
                                    >
                                        Keluar
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <div className="hidden items-center gap-2 md:flex">
                        <Button
                            asChild
                            variant="ghost"
                            className="hidden md:inline-flex"
                        >
                            <Link href="/login">Masuk</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/register">Daftar</Link>
                        </Button>
                    </div>
                )}

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-2 md:hidden">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="container mx-auto max-w-screen-xl space-y-1 px-2 pt-2 pb-3">
                        {navigation.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    'block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-gray-50 hover:text-foreground',
                                    pathname === item.href &&
                                        'bg-gray-50 text-foreground',
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.title}
                            </Link>
                        ))}
                        {user ? (
                            <div className="flex flex-col gap-2 pt-2">
                                <div className="flex items-center gap-2 px-3 py-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={`/storage/${user.avatar_url}`}
                                            alt={user.name}
                                        />
                                        <AvatarFallback>
                                            {user.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <Link
                                    href="/profile"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profil
                                </Link>
                                <Link
                                    href="/forum"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Buka Forum
                                </Link>
                                <Link
                                    href="/collaboration"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Buka Kolaborasi
                                </Link>
                                <DropdownMenuSeparator />
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="block w-full rounded-md bg-red-600 px-3 py-2 text-left text-base font-medium text-slate-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Keluar
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 pt-2">
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="justify-start"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Link href="/login">Masuk</Link>
                                </Button>
                                <Button
                                    asChild
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Link href="/register">Daftar</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
