import { Link, router } from '@inertiajs/react';
import Layout from '@/layouts';
import { Button } from '@/components/ui/button';
import { ForumCard } from '@/components/forum/forum-card';
import { ForumFilters, ForumFilterState } from '@/components/forum/forum-filters';
import { useState, useEffect, useRef } from 'react';
import { Pagination } from '@/components/ui/pagination';
import pickBy from 'lodash/pickBy'; 

interface ForumPost {
    id: number;
    title: string;
    slug: string;
    description: string;
    image?: string | null;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    tags: string[];
    likes_count: number;
    comments_count: number;
    created_at: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface PaginatedData<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
}

interface ForumIndexProps {
    forums: PaginatedData<ForumPost>;
    categories: Category[];
    filters: ForumFilterState;
}

export default function ForumIndexPage({ forums, categories, filters }: ForumIndexProps) {
    const [filterValues, setFilterValues] = useState<ForumFilterState>({
        search: filters.search || '',
        category: filters.category || 'all',
        sort: filters.sort || 'latest',
    });

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const handler = setTimeout(() => {
            const query = pickBy(filterValues); 

            router.get('/forum', query, {
                preserveState: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(handler);
    }, [filterValues]); 

    return (
        <Layout>
            <main className="container mx-auto px-12 py-8 md:py-12">
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold md:text-3xl">Forum Ide & Diskusi</h1>
                        <p className="text-muted-foreground">Temukan topik menarik atau bagikan ide brilian Anda.</p>
                    </div>
                    <Button asChild>
                        <Link href="/forum/buat">Buat Topik Baru</Link>
                    </Button>
                </header>

                <section className="mt-6">
                    <ForumFilters
                        value={filterValues}
                        categories={categories}
                        onChange={setFilterValues}
                        onApply={() => router.get('/forum', pickBy(filterValues), { preserveState: true, replace: true })}
                    />
                </section>

                <section className="mt-8">
                    {forums.data.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {forums.data.map((post) => (
                                <ForumCard
                                    key={post.id}
                                    post={{
                                        id: String(post.id),
                                        title: post.title,
                                        description: post.description,
                                        image: post.image,
                                        category: post.category,
                                        tags: post.tags,
                                        slug: post.slug,
                                        likesCount: post.likes_count,
                                        commentsCount: post.comments_count,
                                        createdAt: post.created_at,
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="col-span-full rounded-md border p-8 text-center text-muted-foreground">
                            <p className="font-medium">Tidak ada topik yang ditemukan.</p>
                            <p className="text-sm">Coba ubah kata kunci pencarian atau filter Anda.</p>
                        </div>
                    )}
                </section>
                
                <section className="mt-8 flex justify-center">
                    <Pagination links={forums.links} />
                </section>
            </main>
        </Layout>
    );
}