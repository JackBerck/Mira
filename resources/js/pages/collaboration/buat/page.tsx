import { CollabForm } from '@/components/collab/collab-form';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
}

interface PageProps extends Record<string, unknown> {
    categories: Category[];
}

export default function NewCollabPage() {
    const { categories } = usePage<PageProps>().props;

    return (
        <AppLayout>
            <main className="container mx-auto space-y-6 px-4 py-8">
                <header className="space-y-1">
                    <h1 className="text-2xl font-semibold">
                        Buat Kolaborasi Baru
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Jelaskan tujuan, dampak, dan keahlian yang dibutuhkan
                        agar orang tepat bisa bergabung.
                    </p>
                </header>
                <section className="max-w-2xl">
                    <CollabForm categories={categories} />
                </section>
            </main>
        </AppLayout>
    );
}
