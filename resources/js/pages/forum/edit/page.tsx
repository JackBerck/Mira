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
    initial: {
        title: string;
        description: string;
        forum_category_id: number;
        tags: string[];
        image: string | null;
    };
}

export default function EditForumPage() {
    const { categories, initial } = usePage<PageProps>().props;
    return (
        <AppLayout>
            <main className="container mx-auto space-y-6 px-12 py-8">
                <header className="space-y-1">
                    <h1 className="text-2xl font-semibold">Edit Forum</h1>
                    <p className="text-sm text-muted-foreground">
                        Jelaskan topik diskusi Anda agar orang lain dapat
                        memberikan tanggapan yang tepat.
                    </p>
                </header>
                <section className="">
                    <ForumForm categories={categories} initial={initial} />
                </section>
            </main>
        </AppLayout>
    );
}
