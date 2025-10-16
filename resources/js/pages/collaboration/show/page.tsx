import { Badge } from '@/components/ui/badge';
import { SendMessageDialog } from '@/components/collaboration/send-message-dialog';
import { JoinCollaborationDialog } from '@/components/collaboration/join-collaboration-dialog';
import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Collaborator {
    id: number;
    role: string;
    user: {
        id: number;
        name: string;
        avatar: string | null;
    };
    joined_at: string;
}

interface Collaboration {
    id: number;
    title: string;
    slug: string;
    description: string;
    skills_needed: string[];
    status: 'open' | 'in-progress' | 'completed';
    image: string | null;
    forum_category_id: number;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    user: {
        id: number;
        name: string;
        avatar: string | null;
    };
    collaborators: Collaborator[];
    collaborators_count: number;
    chats_count: number;
    created_at: string;
    updated_at: string;
}

interface PageProps extends Record<string, unknown> {
    collaboration: Collaboration;
}

export default function CollabDetailPage() {
    const { collaboration, auth } = usePage<PageProps>().props;
    const currentUser = (auth as { user: { id: number } }).user;
    const isOwner = collaboration.user.id === currentUser.id;

    const statusLabel = {
        open: 'Terbuka',
        'in-progress': 'Sedang Berjalan',
        completed: 'Selesai',
    }[collaboration.status];

    const statusVariant = {
        open: 'default' as const,
        'in-progress': 'secondary' as const,
        completed: 'outline' as const,
    }[collaboration.status];

    return (
        <AppLayout>
            <main className="container mx-auto space-y-8 px-4 py-8">
                {/* Back Navigation */}
                <Link
                    href="/beranda/kolaborasi"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Kolaborasi
                </Link>

                <header className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                            {collaboration.category.name}
                        </Badge>
                        <Badge className="capitalize" variant={statusVariant}>
                            {statusLabel}
                        </Badge>
                    </div>
                    <h1 className="text-2xl font-semibold text-balance md:text-3xl">
                        {collaboration.title}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {collaboration.collaborators_count}{' '}
                        {collaboration.collaborators_count === 1
                            ? 'anggota'
                            : 'anggota'}{' '}
                        •{' '}
                        {new Date(collaboration.updated_at).toLocaleDateString(
                            'id-ID',
                            {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            },
                        )}
                    </p>
                </header>

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {collaboration.image && (
                            <img
                                src={collaboration.image}
                                alt={`Banner ${collaboration.title}`}
                                className="h-56 w-full rounded-md object-cover md:h-72"
                            />
                        )}
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
                                Array.isArray(collaboration.skills_needed) &&
                                collaboration.skills_needed.length > 0 ? (
                                    collaboration.skills_needed.map(
                                        (s, index) => (
                                            <Badge
                                                key={`${s}-${index}`}
                                                variant="outline"
                                                className="bg-background"
                                            >
                                                {s}
                                            </Badge>
                                        ),
                                    )
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada keahlian yang ditentukan
                                    </p>
                                )}
                            </div>
                        </div>

                        {collaboration.chats_count > 0 && (
                            <div className="space-y-3">
                                <h2 className="text-lg font-semibold">
                                    Aktivitas Terbaru
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {collaboration.chats_count} diskusi dalam
                                    kolaborasi ini
                                </p>
                            </div>
                        )}
                    </div>

                    <aside className="space-y-6">
                        {isOwner ? (
                            <div className="space-y-2">
                                <h3 className="font-semibold">
                                    Kelola Kolaborasi
                                </h3>
                                <Link
                                    href={`/beranda/kolaborasi/${collaboration.slug}/edit`}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full"
                                >
                                    Edit Kolaborasi
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <h3 className="font-semibold">
                                    Mulai Berkolaborasi
                                </h3>
                                <JoinCollaborationDialog
                                    collaborationId={collaboration.id}
                                    collaborationTitle={collaboration.title}
                                />
                                <SendMessageDialog
                                    receiverId={collaboration.user.id}
                                    receiverName={collaboration.user.name}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <h3 className="font-semibold">Pembuat</h3>
                            <div className="flex items-center gap-2">
                                {collaboration.user.avatar ? (
                                    <img
                                        src={collaboration.user.avatar}
                                        alt={collaboration.user.name}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                        <span className="text-xs font-medium text-primary">
                                            {collaboration.user.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <p className="text-sm font-medium">
                                    {collaboration.user.name}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Dibuat{' '}
                                {new Date(
                                    collaboration.created_at,
                                ).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-semibold">
                                Tim Kolaborasi (
                                {collaboration.collaborators_count})
                            </h3>
                            {collaboration.collaborators &&
                            collaboration.collaborators.length > 0 ? (
                                <ul className="space-y-2">
                                    {collaboration.collaborators.map(
                                        (collaborator) => (
                                            <li
                                                key={collaborator.id}
                                                className="flex items-center gap-2"
                                            >
                                                {collaborator.user.avatar ? (
                                                    <img
                                                        src={
                                                            collaborator.user
                                                                .avatar
                                                        }
                                                        alt={
                                                            collaborator.user
                                                                .name
                                                        }
                                                        className="h-6 w-6 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                                        <span className="text-[10px] font-medium text-primary">
                                                            {collaborator.user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        {collaborator.user.name}
                                                    </p>
                                                    {collaborator.role && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {collaborator.role}
                                                        </p>
                                                    )}
                                                </div>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada anggota yang bergabung
                                </p>
                            )}
                        </div>
                    </aside>
                </section>
            </main>
        </AppLayout>
    );
}
