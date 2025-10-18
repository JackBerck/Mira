import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    Edit,
    Heart,
    MessageSquare,
    Share2,
    Tag,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        avatar: string;
    };
    is_owner: boolean;
}

interface Forum {
    id: number;
    title: string;
    description: string;
    image: string | null;
    tags: string[];
    category: {
        id: number;
        name: string;
        slug: string;
    };
    user: {
        id: number;
        name: string;
        avatar: string;
    };
    likes_count: number;
    comments_count: number;
    created_at: string;
}

interface ForumShowProps {
    forum: Forum;
    comments: Comment[];
    isLiked: boolean;
    currentUserId: number | null;
    isAuthenticated: boolean;
}

export default function ForumShowPage({
    forum,
    comments,
    isLiked,
    isAuthenticated,
}: ForumShowProps) {
    const [liked, setLiked] = useState(isLiked);
    const [likesCount, setLikesCount] = useState(forum.likes_count);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(
        null,
    );
    const [editContent, setEditContent] = useState('');

    const { data, setData, post, processing, reset } = useForm({
        content: '',
    });

    const handleLike = () => {
        if (!isAuthenticated) {
            router.visit('/login');
            return;
        }

        router.post(
            `/beranda/forum/${forum.id}/like`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setLiked(!liked);
                    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
                },
            },
        );
    };

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            router.visit('/login');
            return;
        }

        post(`/beranda/forum/${forum.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleEditComment = (commentId: number, content: string) => {
        setEditingCommentId(commentId);
        setEditContent(content);
    };

    const handleDeleteComment = (commentId: number) => {
        router.delete(`/beranda/forum/${forum.id}/comment/${commentId}`, {
            preserveScroll: true,
        });
    };

    const handleUpdateComment = (commentId: number) => {
        router.put(
            `/beranda/forum/${forum.id}/comment/${commentId}`,
            { content: editContent },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingCommentId(null);
                    setEditContent('');
                },
            },
        );
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: forum.title,
                text: forum.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link berhasil disalin!');
        }
    };

    return (
        <AppLayout>
            <Head title={forum.title} />
            <div className="section-padding-x py-8">
                <div className="mx-auto max-w-screen-xl">
                    {/* Back Button */}
                    <Link
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            window.history.back();
                        }}
                        className="mb-6 inline-flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900"
                    >
                        ← Kembali ke Forum
                    </Link>

                    {/* Forum Header */}
                    <Card className="mb-6 border-0 shadow-sm">
                        <CardContent className="p-6">
                            {/* Category Badge */}
                            <Badge variant="outline" className="mb-4">
                                {forum.category.name}
                            </Badge>

                            {/* Title */}
                            <h1 className="mb-4 text-3xl font-bold text-gray-900">
                                {forum.title}
                            </h1>

                            {/* Meta Info */}
                            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={forum.user.avatar}
                                        alt={forum.user.name}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                    <span className="font-medium">
                                        {forum.user.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {forum.created_at}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    {likesCount} Suka
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="h-4 w-4" />
                                    {comments.length} Komentar
                                </div>
                            </div>

                            {/* Image */}
                            {forum.image && (
                                <div className="mb-6 overflow-hidden rounded-lg">
                                    <img
                                        src={forum.image}
                                        alt={forum.title}
                                        className="h-96 w-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Description */}
                            <div className="prose prose-sm mb-6 max-w-none">
                                <p className="whitespace-pre-wrap text-gray-700">
                                    {forum.description}
                                </p>
                            </div>

                            {/* Tags */}
                            {forum.tags && forum.tags.length > 0 && (
                                <div className="mb-6 flex flex-wrap gap-2">
                                    {forum.tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            <Tag className="h-3 w-3" />
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleLike}
                                    variant={liked ? 'default' : 'outline'}
                                    className={
                                        liked
                                            ? 'bg-red-500 hover:bg-red-600'
                                            : ''
                                    }
                                >
                                    <Heart
                                        className={`mr-2 h-4 w-4 ${
                                            liked ? 'fill-current' : ''
                                        }`}
                                    />
                                    {liked ? 'Disukai' : 'Suka'}
                                </Button>
                                <Button variant="outline" onClick={handleShare}>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Bagikan
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comments Section */}
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <h2 className="mb-6 text-xl font-semibold">
                                Komentar ({comments.length})
                            </h2>

                            {/* Comment Form */}
                            {isAuthenticated ? (
                                <form onSubmit={handleComment} className="mb-6">
                                    <Textarea
                                        placeholder="Tulis komentar Anda..."
                                        value={data.content}
                                        onChange={(e) =>
                                            setData('content', e.target.value)
                                        }
                                        className="mb-3"
                                        rows={3}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={
                                            processing || !data.content.trim()
                                        }
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Kirim Komentar
                                    </Button>
                                </form>
                            ) : (
                                <div className="mb-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                                    <p className="mb-3 text-gray-600">
                                        Silakan login untuk berkomentar
                                    </p>
                                    <Link href="/login">
                                        <Button className="bg-blue-600 hover:bg-blue-700">
                                            Login
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            {/* Comments List */}
                            <div className="space-y-4">
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                                        >
                                            <div className="mb-3 flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            comment.user.avatar
                                                        }
                                                        alt={comment.user.name}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {comment.user.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {comment.created_at}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Action buttons for comment owner */}
                                                {comment.is_owner && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleEditComment(
                                                                    comment.id,
                                                                    comment.content,
                                                                )
                                                            }
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>
                                                                        Hapus
                                                                        Komentar?
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Tindakan
                                                                        ini
                                                                        tidak
                                                                        dapat
                                                                        dibatalkan.
                                                                        Komentar
                                                                        akan
                                                                        dihapus
                                                                        secara
                                                                        permanen.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>
                                                                        Batal
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() =>
                                                                            handleDeleteComment(
                                                                                comment.id,
                                                                            )
                                                                        }
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Hapus
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Comment content or edit form */}
                                            {editingCommentId === comment.id ? (
                                                <div className="mt-3">
                                                    <Textarea
                                                        value={editContent}
                                                        onChange={(e) =>
                                                            setEditContent(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mb-2"
                                                        rows={3}
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                handleUpdateComment(
                                                                    comment.id,
                                                                )
                                                            }
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            Simpan
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setEditingCommentId(
                                                                    null,
                                                                );
                                                                setEditContent(
                                                                    '',
                                                                );
                                                            }}
                                                        >
                                                            Batal
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="whitespace-pre-wrap text-gray-700">
                                                    {comment.content}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-gray-500">
                                        <MessageSquare className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                        <p>Belum ada komentar</p>
                                        <p className="text-sm">
                                            Jadilah yang pertama berkomentar!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
