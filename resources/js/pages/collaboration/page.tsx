import { CollabCard } from '@/components/collab/collab-card';
import {
    CollabFilters,
    type CollabFilterState,
} from '@/components/collab/collab-filters';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Collaboration {
    id: number;
    title: string;
    slug: string;
    description: string;
    skills_needed: string[];
    status: 'open' | 'in_progress' | 'completed';
    image: string | null;
    forum_category_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    category?: {
        id: number;
        name: string;
    };
    user?: {
        id: number;
        name: string;
    };
}

interface PageProps extends Record<string, unknown> {
    collaborations: {
        data: Collaboration[];
        total: number;
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        category?: string;
        status?: string;
        sort?: string;
    };
}

export default function KolaborasiPage() {
    const { collaborations, filters: initialFilters } =
        usePage<PageProps>().props;

    const [filters, setFilters] = useState<CollabFilterState>({
        search: initialFilters?.search || '',
        category: initialFilters?.category || 'Semua',
        status: initialFilters?.status || 'Semua',
        sort: initialFilters?.sort || 'latest',
    });

    const handleApplyFilters = () => {
        const params: Record<string, string> = {};
        if (filters.search) params.search = filters.search;
        if (filters.category && filters.category !== 'Semua')
            params.category = filters.category;
        if (filters.status && filters.status !== 'Semua')
            params.status = filters.status;
        if (filters.sort) params.sort = filters.sort;

        router.get('/kolaborasi', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const items = collaborations?.data || [];
    const isLoading = false;

    // Transform Laravel data to match frontend expectations
    const transformedItems = items.map((collab) => {
        const categoryName = collab.category?.name || 'Teknologi';
        const mappedCategory = [
            'Teknologi',
            'Sosial',
            'Kreatif',
            'Lingkungan',
        ].includes(categoryName)
            ? categoryName
            : 'Teknologi';

        return {
            id: String(collab.id),
            slug: collab.slug,
            title: collab.title,
            description: collab.description,
            category: mappedCategory as
                | 'Teknologi'
                | 'Sosial'
                | 'Kreatif'
                | 'Lingkungan',
            status: (collab.status === 'in_progress'
                ? 'in-progress'
                : collab.status) as 'open' | 'in-progress' | 'completed',
            membersCount: 0,
            skillsNeeded: collab.skills_needed || [],
            forumId: collab.forum_category_id
                ? String(collab.forum_category_id)
                : undefined,
            coverUrl: collab.image
                ? `/storage/${collab.image}`
                : '/kolaborasi-cover.jpg',
            createdAt: collab.created_at,
            updatedAt: collab.updated_at,
        };
    });

    return (
        <AppLayout>
            <main className="container mx-auto space-y-6 px-4 py-8 md:py-12">
                <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-balance md:text-3xl">
                            Yuk Kolaborasi
                        </h1>
                        <p className="mt-1 max-w-2xl text-pretty text-muted-foreground">
                            Bentuk tim lintas minat untuk merealisasikan ide.
                            Cari peluang, saring berdasarkan kategori dan
                            status, lalu gabung ke kolaborasi yang relevan.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/beranda/kolaborasi/buat">Tambah Kolaborasi</Link>
                    </Button>
                </header>
                <section
                    aria-label="Filter kolaborasi"
                    className="rounded-lg border bg-card p-4"
                >
                    <CollabFilters
                        value={filters}
                        onChange={setFilters}
                        onApply={handleApplyFilters}
                    />
                </section>{' '}
                <section aria-live="polite" className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium text-muted-foreground">
                            {isLoading
                                ? 'Memuat...'
                                : `${collaborations?.total ?? 0} kolaborasi ditemukan`}
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-56 animate-pulse rounded-md border bg-muted/40"
                                />
                            ))}
                        </div>
                    ) : transformedItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {transformedItems.map((c) => (
                                <CollabCard key={c.id} collab={c} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border bg-card p-8 text-center">
                            <p className="text-muted-foreground">
                                Belum ada kolaborasi sesuai kriteria.
                            </p>
                            <Button asChild className="mt-4">
                                <Link href="/kolaborasi/buat">
                                    Buat Kolaborasi
                                </Link>
                            </Button>
                        </div>
                    )}
                </section>
            </main>
        </AppLayout>
    );
}
