import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts';
import { Link, usePage } from '@inertiajs/react';

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
    collaboration: Collaboration;
}

export default function CollabDetailPage() {
    const { collaboration } = usePage<PageProps>().props;

    const statusLabel = {
        open: 'Terbuka',
        in_progress: 'Sedang Berjalan',
        completed: 'Selesai',
    }[collaboration.status];

    return (
        <Layout>
            <main className="container mx-auto space-y-8 px-4 py-8">
                <header className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                            {collaboration.category?.name || 'Umum'}
                        </Badge>
                        <Badge
                            className="capitalize"
                            variant={
                                collaboration.status === 'open'
                                    ? 'default'
                                    : 'secondary'
                            }
                        >
                            {statusLabel}
                        </Badge>
                    </div>
                    <h1 className="text-2xl font-semibold text-balance md:text-3xl">
                        {collaboration.title}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        0 anggota •{' '}
                        {new Date(collaboration.updated_at).toLocaleDateString(
                            'id-ID',
                        )}
                    </p>
                </header>

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <img
                            src={
                                collaboration.image || '/kolaborasi-banner.jpg'
                            }
                            alt={`Banner ${collaboration.title}`}
                            className="h-56 w-full rounded-md object-cover md:h-72"
                        />
                        <article className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-pretty">
                                {collaboration.description}
                            </p>
                        </article>

                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold">
                                Kebutuhan & Peran
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {collaboration.skills_needed &&
                                collaboration.skills_needed.length > 0 ? (
                                    collaboration.skills_needed.map((s) => (
                                        <Badge
                                            key={s}
                                            variant="outline"
                                            className="bg-background"
                                        >
                                            {s}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada keahlian yang ditentukan
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold">
                                Aktivitas (Preview)
                            </h2>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                                <li>Diskusi awal ide, menyusun scope MVP</li>
                                <li>Riset singkat referensi & teknologi</li>
                                <li>
                                    Rencana sprint 1 (2 pekan) dan pembagian
                                    tugas
                                </li>
                            </ul>
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="font-semibold">
                                Mulai Berkolaborasi
                            </h3>
                            <Button
                                className="w-full"
                                onClick={() =>
                                    alert(
                                        'Permintaan bergabung terkirim (placeholder).',
                                    )
                                }
                            >
                                Gabung Tim
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={() =>
                                    alert(
                                        'Kirim pesan ke pengunggah (placeholder).',
                                    )
                                }
                            >
                                Kirim Pesan
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Tautan Terkait</h3>
                            {collaboration.forum_category_id ? (
                                <Link
                                    href={`/forum/${collaboration.forum_category_id}`}
                                    className="text-sm underline underline-offset-4"
                                >
                                    Baca topik forum asal kolaborasi
                                </Link>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Tidak terkait forum
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Pembuat</h3>
                            <p className="text-sm">
                                {collaboration.user?.name || 'Pengguna'}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Tim (Preview)</h3>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>Inisiator (Lead)</li>
                                <li>Frontend Engineer</li>
                                <li>UX Researcher</li>
                                <li>PM/Koordinator</li>
                            </ul>
                        </div>
                    </aside>
                </section>
            </main>
        </Layout>
    );
}
