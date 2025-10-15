import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils'; 
import { ChevronLeft, ChevronRight } from "lucide-react";

// Tipe data untuk setiap link yang dikirim oleh Laravel
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

export function Pagination({ links }: PaginationProps) {
    if (links.length < 3) return null;

    return (
        <nav aria-label="Pagination" className="flex justify-center mt-6">
            <ul className="flex items-center space-x-1">
                {links.map((link, index) => {
                    const isPrevious = link.label.includes("pagination.previous");
                    const isNext = link.label.includes("pagination.next");

                    // Tentukan label yang akan ditampilkan
                    let displayLabel: React.ReactNode = link.label;

                    if (isPrevious) displayLabel = <ChevronLeft className="w-4 h-4" />;
                    if (isNext) displayLabel = <ChevronRight className="w-4 h-4" />;

                    // Link tidak bisa diklik
                    if (link.url === null) {
                        return (
                            <li key={index}>
                                <span className="px-3 py-2 text-sm text-muted-foreground opacity-50">
                                    {displayLabel}
                                </span>
                            </li>
                        );
                    }

                    // Link aktif atau bisa diklik
                    return (
                        <li key={index}>
                            <Link
                                href={link.url}
                                preserveScroll
                                className={cn(
                                    "flex items-center justify-center rounded-md px-3 py-2 text-sm transition-colors",
                                    link.active 
                                        ? "bg-primary text-primary-foreground font-semibold" 
                                        : "bg-background hover:bg-accent"
                                )}
                            >
                                {displayLabel}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
