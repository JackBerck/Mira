import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProfileLayout from '@/layouts/profile-layout';
import { Link, router } from '@inertiajs/react';
import {
    Calendar,
    Edit,
    Eye,
    Heart,
    MessageSquare,
    Plus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Forum {
    id: number;
    title: string;
    slug: string;
    description: string;
    tags: string[];
    image?: string;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    user: {
        id: number;
        name: string;
    };
    likes_count: number;
    comments_count: number;
    created_at: string;
    updated_at: string;
}

interface MyForumsProps {
    forums: {
        data: Forum[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function MyForums({ forums }: MyForumsProps) {
    // Ensure data exists
    const forumsData = forums?.data || [];
    const forumsTotal = forums?.total || 0;
    const forumsCurrentPage = forums?.current_page || 1;
    const forumsLastPage = forums?.last_page || 1;

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [forumToDelete, setForumToDelete] = useState<{
        slug: string;
        title: string;
    } | null>(null);

    const openDeleteDialog = (slug: string, title: string) => {
        setForumToDelete({ slug, title });
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!forumToDelete) return;

        router.delete(`/beranda/forum/${forumToDelete.slug}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setForumToDelete(null);
                router.reload({ only: ['forums'] });
            },
            onError: () => {
                setDeleteDialogOpen(false);
                setForumToDelete(null);
                // optional: show toast
                alert('Gagal menghapus forum. Silakan coba lagi.');
            },
        });
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    return (
        <>
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Forum?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Yakin ingin menghapus forum "{forumToDelete?.title}
                            "? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <ProfileLayout title="Forum Saya">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Forum yang Saya Buat
                            </h2>
                            <p className="text-gray-600">
                                Kelola semua forum diskusi yang telah Anda buat
                                ({forumsTotal} total)
                            </p>
                        </div>

                        <Link href="/beranda/forum/buat">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Forum Baru
                            </Button>
                        </Link>
                    </div>

                    {/* Forums List */}
                    {forumsData.length > 0 ? (
                        <div className="space-y-4">
                            {forumsData.map((forum) => (
                                <Card
                                    key={forum.id}
                                    className="border-0 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            {/* Forum Image */}
                                            {forum.image && (
                                                <div className="hidden h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg sm:block">
                                                    <img
                                                        src={forum.image}
                                                        alt={forum.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            {/* Forum Content */}
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-3 flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <Link
                                                            href={`/beranda/forum/${forum.slug}`}
                                                            className="block"
                                                        >
                                                            <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 transition-colors hover:text-blue-600">
                                                                {forum.title}
                                                            </h3>
                                                        </Link>

                                                        <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {forum.category
                                                                    ?.name ||
                                                                    'Tanpa Kategori'}
                                                            </Badge>
                                                            <div className="flex items-center">
                                                                <Calendar className="mr-1 h-3 w-3" />
                                                                {formatDate(
                                                                    forum.created_at,
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="ml-4 flex items-center gap-2">
                                                        <Link
                                                            href={`/beranda/forum/${forum.slug}`}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link
                                                            href={`/beranda/forum/${forum.slug}/edit`}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                openDeleteDialog(
                                                                    forum.slug,
                                                                    forum.title,
                                                                )
                                                            }
                                                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                                                    {forum.description}
                                                </p>

                                                {/* Tags */}
                                                {forum.tags &&
                                                    Array.isArray(forum.tags) &&
                                                    forum.tags.length > 0 && (
                                                        <div className="mb-3 flex flex-wrap gap-2">
                                                            {forum.tags
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        tag,
                                                                        index,
                                                                    ) => (
                                                                        <Badge
                                                                            key={
                                                                                index
                                                                            }
                                                                            variant="secondary"
                                                                            className="text-xs"
                                                                        >
                                                                            {
                                                                                tag
                                                                            }
                                                                        </Badge>
                                                                    ),
                                                                )}
                                                            {forum.tags.length >
                                                                3 && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    {forum.tags
                                                                        .length -
                                                                        3}{' '}
                                                                    lagi
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}

                                                {/* Stats */}
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <Heart className="mr-1 h-4 w-4" />
                                                        {forum.likes_count || 0}{' '}
                                                        suka
                                                    </div>
                                                    <div className="flex items-center">
                                                        <MessageSquare className="mr-1 h-4 w-4" />
                                                        {forum.comments_count ||
                                                            0}{' '}
                                                        komentar
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-12 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <MessageSquare className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-gray-900">
                                    Belum Ada Forum
                                </h3>
                                <p className="mx-auto mb-6 max-w-md text-gray-600">
                                    Anda belum membuat forum diskusi. Mulai
                                    berbagi ide dan diskusi dengan komunitas!
                                </p>
                                <Link href="/beranda/forum/buat">
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Forum Pertama
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination */}
                    {forumsLastPage > 1 && (
                        <div className="flex justify-center">
                            <div className="flex items-center space-x-2">
                                {Array.from(
                                    { length: forumsLastPage },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <Button
                                        key={page}
                                        variant={
                                            page === forumsCurrentPage
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        onClick={() =>
                                            router.get('/profile/my-forums', {
                                                page,
                                            })
                                        }
                                        className="h-10 w-10"
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </ProfileLayout>
        </>
    );
}
