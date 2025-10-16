import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProfileLayout from '@/layouts/profile-layout';
import { Link, router } from '@inertiajs/react';
import { Calendar, Eye, Heart, MessageSquare, User } from 'lucide-react';

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
    liked_at: string;
}

interface LikedForumsProps {
    likedForums: {
        data: Forum[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function LikedForums({ likedForums }: LikedForumsProps) {
    const forumsData = likedForums?.data || [];
    const forumsTotal = likedForums?.total || 0;
    const forumsCurrentPage = likedForums?.current_page || 1;
    const forumsLastPage = likedForums?.last_page || 1;

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
        <ProfileLayout title="Forum yang Disukai">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Forum yang Disukai
                        </h2>
                        <p className="text-gray-600">
                            Semua forum diskusi yang telah Anda sukai (
                            {forumsTotal} total)
                        </p>
                    </div>
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
                                                            <User className="mr-1 h-3 w-3" />
                                                            {forum.user?.name ||
                                                                'Anonymous'}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Calendar className="mr-1 h-3 w-3" />
                                                            {formatDate(
                                                                forum.created_at,
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action */}
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
                                                                        {tag}
                                                                    </Badge>
                                                                ),
                                                            )}
                                                        {forum.tags.length >
                                                            3 && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                +
                                                                {forum.tags
                                                                    .length -
                                                                    3}{' '}
                                                                lagi
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}

                                            {/* Stats and Liked Date */}
                                            <div className="flex items-center justify-between">
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
                                                <div className="text-xs text-gray-400">
                                                    Disukai{' '}
                                                    {formatDate(forum.liked_at)}
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
                                <Heart className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                                Belum Ada Forum yang Disukai
                            </h3>
                            <p className="mx-auto mb-6 max-w-md text-gray-600">
                                Anda belum menyukai forum manapun. Jelajahi
                                forum dan berikan like pada diskusi yang
                                menarik!
                            </p>
                            <Link href="/forum">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Jelajahi Forum
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
                                        router.get('/profile/liked-forums', {
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
    );
}
