import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Clock,
    Flag,
    Heart,
    MessageCircle,
    MoreVertical,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import AdminReport from '../admin-report';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../ui/alert-dialog';
import type { Forum } from './forum-types';

export function ForumListItem({ forum }: { forum: Forum }) {
    const [showReportDialog, setShowReportDialog] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const { props } = usePage<{
        auth: { user?: { id: number; role?: string } };
    }>();
    const currentUser = props.auth?.user;

    // Check if user can delete (owner or admin)
    const canDelete =
        currentUser &&
        (currentUser.id === forum.user.id || currentUser.role === 'admin');

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenDelete(true);
    };

    const handleConfirmDelete = () => {
        router.delete(`/beranda/forum/${forum.slug}`, {
            preserveScroll: true,
            onSuccess: () => {
                setOpenDelete(false);
            },
            onError: (errors) => {
                console.error('Error deleting forum:', errors);
                setOpenDelete(false);
                alert('Gagal menghapus forum. Silakan coba lagi.');
            },
        });
    };

    const handleReport = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowReportDialog(true);
    };

    return (
        <>
            {/* Report Dialog */}
            <AdminReport
                reportableType="App\Models\Forum"
                reportableId={forum.id}
                isOpen={showReportDialog}
                onClose={() => setShowReportDialog(false)}
            />

            {/* Delete confirmation dialog */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Forum?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Semua komentar
                            dan interaksi akan terhapus.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <button className="btn btn-outline">Batal</button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <button
                                onClick={handleConfirmDelete}
                                className="btn btn-destructive ml-2"
                            >
                                Hapus
                            </button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Card className="overflow-hidden border bg-card text-card-foreground transition-all hover:border-primary/50 hover:shadow-md">
                <CardContent className="p-0">
                    <div className="relative">
                        <Link
                            href={`/beranda/forum/${forum.slug}`}
                            className="block focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <div className="flex flex-col gap-3 p-4 md:flex-row">
                                {/* Left: Image (if exists) */}
                                {forum.image && (
                                    <div className="flex-shrink-0 md:w-40">
                                        <img
                                            src={forum.image}
                                            alt={`Cover forum ${forum.title}`}
                                            className="h-24 w-full rounded-md object-cover md:h-28"
                                        />
                                    </div>
                                )}

                                {/* Right: Content */}
                                <div className="flex-1 space-y-2">
                                    {/* Header with Category and Author */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="h-5 px-2 py-0 text-xs"
                                        >
                                            {forum.category.name}
                                        </Badge>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            {forum.user.avatar ? (
                                                <img
                                                    src={forum.user.avatar}
                                                    alt={forum.user.name}
                                                    className="h-4 w-4 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10">
                                                    <span className="text-[9px] font-medium text-primary">
                                                        {forum.user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <span>{forum.user.name}</span>
                                            <span>•</span>
                                            <div className="flex items-center gap-0.5">
                                                <Clock className="h-3 w-3" />
                                                <span>
                                                    {new Date(
                                                        forum.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="line-clamp-2 text-lg leading-tight font-bold text-pretty transition-colors hover:text-primary">
                                        {forum.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                        {forum.description}
                                    </p>

                                    {/* Footer with Tags and Stats */}
                                    <div className="flex items-center justify-between pt-1">
                                        {/* Tags */}
                                        {forum.tags &&
                                            Array.isArray(forum.tags) &&
                                            forum.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {forum.tags
                                                        .slice(0, 3)
                                                        .map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted/80"
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    {forum.tags.length > 3 && (
                                                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                            +
                                                            {forum.tags.length -
                                                                3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                        {/* Stats */}
                                        <div className="ml-auto flex items-center gap-3 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1 transition-colors hover:text-red-500">
                                                <Heart className="h-3.5 w-3.5" />
                                                <span className="text-xs font-medium">
                                                    {forum.likes_count}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 transition-colors hover:text-blue-500">
                                                <MessageCircle className="h-3.5 w-3.5" />
                                                <span className="text-xs font-medium">
                                                    {forum.comments_count}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Dropdown Menu for Actions - Show for all logged-in users */}
                        {currentUser && (
                            <div className="absolute top-2 right-2 z-10">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full hover:bg-muted"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={handleReport}
                                        >
                                            <Flag className="mr-2 h-4 w-4" />
                                            Laporkan ke Admin
                                        </DropdownMenuItem>

                                        {canDelete && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="cursor-pointer text-destructive focus:text-destructive"
                                                    onClick={handleDeleteClick}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Hapus Forum
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
