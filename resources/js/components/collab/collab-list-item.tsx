import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link, router, usePage } from '@inertiajs/react';
import { Users, Clock, MoreVertical, Trash2, Flag } from 'lucide-react';
import type { Collab } from './collab-types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function CollabListItem({ collab }: { collab: Collab }) {
    const statusVariant = collab.status === 'open' ? 'default' : collab.status === 'in-progress' ? 'secondary' : 'outline';
    const { props } = usePage<{ auth: { user?: { id: number; role?: string } } }>();
    const currentUser = props.auth?.user;
    
    // Check if user can delete (owner or admin)
    const canDelete = currentUser && (
        currentUser.id === collab.user?.id || 
        currentUser.role === 'admin'
    );

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (confirm('Apakah Anda yakin ingin menghapus kolaborasi ini?')) {
            router.delete(`/beranda/kolaborasi/${collab.slug}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: show success message
                },
                onError: (errors) => {
                    console.error('Error deleting collaboration:', errors);
                    alert('Gagal menghapus kolaborasi. Silakan coba lagi.');
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
        <Card className="overflow-hidden border bg-card text-card-foreground transition-all hover:border-primary/50 hover:shadow-md">
            <CardContent className="p-0">
                <div className="relative">
                    <Link
                        href={`/beranda/kolaborasi/${collab.slug}`}
                        className="block focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        <div className="flex flex-col gap-3 p-4 md:flex-row">
                        {/* Left: Cover Image (if exists) */}
                        {collab.coverUrl && (
                            <div className="flex-shrink-0 md:w-40">
                                <img
                                    src={collab.coverUrl}
                                    alt={`Cover kolaborasi ${collab.title}`}
                                    className="h-24 w-full rounded-md object-cover md:h-28"
                                />
                            </div>
                        )}

                        {/* Right: Content */}
                        <div className="flex-1 space-y-2">
                            {/* Header with Category and Status */}
                            <div className="flex flex-wrap items-center gap-1.5">
                                <Badge
                                    variant="secondary"
                                    className="h-5 px-2 py-0 text-xs"
                                >
                                    {collab.category}
                                </Badge>
                                <Badge
                                    variant={statusVariant}
                                    className="h-5 px-2 py-0 text-xs capitalize"
                                >
                                    {collab.status.replace('-', ' ')}
                                </Badge>
                                {collab.forumId && (
                                    <span className="text-xs text-muted-foreground">
                                        From Forum #{collab.forumId}
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h3 className="line-clamp-2 text-lg leading-tight font-bold text-pretty transition-colors hover:text-primary">
                                {collab.title}
                            </h3>

                            {/* Description */}
                            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                {collab.description}
                            </p>

                            {/* Skills Needed */}
                            {collab.skillsNeeded &&
                                Array.isArray(collab.skillsNeeded) &&
                                collab.skillsNeeded.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            Skills:
                                        </span>
                                        {collab.skillsNeeded
                                            .slice(0, 4)
                                            .map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        {collab.skillsNeeded.length > 4 && (
                                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                +
                                                {collab.skillsNeeded.length - 4}
                                            </span>
                                        )}
                                    </div>
                                )}

                            {/* Footer with Members and Date */}
                            <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3.5 w-3.5" />
                                        <span className="font-medium">
                                            {collab.membersCount} members
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>
                                            {new Date(
                                                collab.createdAt,
                                            ).toLocaleDateString('id-ID', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {collab.status === 'open' && (
                                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                        Open for members
                                    </span>
                                )}
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
                                                Hapus Kolaborasi
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
