import { Button } from '@/components/ui/button';
import navigation from '@/data/navigation';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export function NavigationBar() {
    const pathname =
        typeof window !== 'undefined' ? window.location.pathname : '';

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

                <div className="flex items-center gap-2">
                    <Button
                        asChild
                        variant="ghost"
                        className="hidden md:inline-flex"
                    >
                        <Link href="/auth/login">Masuk</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/auth/register">Daftar</Link>
                    </Button>
                </div>
            </nav>
        </header>
    );
}
