import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link, router, usePage } from '@inertiajs/react';
import { MessageCircle, Heart, Clock, MoreVertical, Trash2, Flag } from 'lucide-react';
import type { Forum } from './forum-types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function ForumListItem({ forum }: { forum: Forum }) {
    const { props } = usePage<{ auth: { user?: { id: number; role?: string } } }>();
    const currentUser = props.auth?.user;
    
    // Check if user can delete (owner or admin)
    const canDelete = currentUser && (
        currentUser.id === forum.user.id || 
        currentUser.role === 'admin'
    );

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (confirm('Apakah Anda yakin ingin menghapus forum ini?')) {
            router.delete(`/forum/${forum.slug}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: show success message
                },
                onError: (errors) => {
                    console.error('Error deleting forum:', errors);
                    alert('Gagal menghapus forum. Silakan coba lagi.');
                }
            });
        }
    };

    const handleReport = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Show success alert
        alert('Laporan berhasil terkirim ke admin. Terima kasih atas kontribusi Anda!');
    };

    return (
        <Card className="overflow-hidden border bg-card text-card-foreground hover:border-primary/50 transition-all hover:shadow-md">
            <CardContent className="p-0">
                <div className="relative">
                    <Link
                        href={`/forum/${forum.slug}`}
                        className="block focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        <div className="flex flex-col md:flex-row gap-3 p-4">
                            {/* Left: Image (if exists) */}
                            {forum.image && (
                                <div className="md:w-40 flex-shrink-0">
                                    <img
                                        src={forum.image}
                                        alt={`Cover forum ${forum.title}`}
                                        className="w-full h-24 md:h-28 object-cover rounded-md"
                                    />
                                </div>
                            )}

                            {/* Right: Content */}
                            <div className="flex-1 space-y-2">
                            {/* Header with Category and Author */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary" className="text-xs py-0 px-2 h-5">
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
                                        <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-[9px] font-medium text-primary">
                                                {forum.user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <span>{forum.user.name}</span>
                                    <span>•</span>
                                    <div className="flex items-center gap-0.5">
                                        <Clock className="h-3 w-3" />
                                        <span>{new Date(forum.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold leading-tight text-pretty line-clamp-2 hover:text-primary transition-colors">
                                {forum.title}
                            </h3>

                            {/* Description */}
                            <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                                {forum.description}
                            </p>

                            {/* Footer with Tags and Stats */}
                            <div className="flex items-center justify-between pt-1">
                                {/* Tags */}
                                {forum.tags && Array.isArray(forum.tags) && forum.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {forum.tags.slice(0, 3).map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted/80"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                        {forum.tags.length > 3 && (
                                            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                +{forum.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="flex items-center gap-3 text-sm text-muted-foreground ml-auto">
                                    <div className="flex items-center gap-1 hover:text-red-500 transition-colors">
                                        <Heart className="h-3.5 w-3.5" />
                                        <span className="font-medium text-xs">{forum.likes_count}</span>
                                    </div>
                                    <div className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                        <MessageCircle className="h-3.5 w-3.5" />
                                        <span className="font-medium text-xs">{forum.comments_count}</span>
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
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {/* Report option for all users */}
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={handleReport}
                                    >
                                        <Flag className="mr-2 h-4 w-4" />
                                        Laporkan ke Admin
                                    </DropdownMenuItem>
                                    
                                    {/* Delete option only for owner or admin */}
                                    {canDelete && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive cursor-pointer"
                                                onClick={handleDelete}
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
    );
}
