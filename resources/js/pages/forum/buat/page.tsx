import { ForumForm } from '@/components/forum/forum-form';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface PageProps extends Record<string, unknown> {
    categories: Category[];
}

export default function NewForumPage() {
    const { categories } = usePage<PageProps>().props;
    return (
        <AppLayout>
            <main className="container mx-auto space-y-6 px-12 py-8">
                <header className="space-y-1">
                    <h1 className="text-2xl font-semibold">Buat Forum Baru</h1>
                    <p className="text-sm text-muted-foreground">
                        Jelaskan topik diskusi Anda agar orang lain dapat
                        memberikan tanggapan yang tepat.
                    </p>
                </header>
                <section className="">
                    <ForumForm categories={categories} />
                </section>
            </main>
        </AppLayout>
    );
}
