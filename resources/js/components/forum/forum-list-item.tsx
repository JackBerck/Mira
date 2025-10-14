import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { MessageCircle, Heart, Clock } from 'lucide-react';
import type { Forum } from './forum-types';

export function ForumListItem({ forum }: { forum: Forum }) {
    return (
        <Card className="overflow-hidden border bg-card text-card-foreground hover:border-primary/50 transition-all hover:shadow-md">
            <Link
                href={`/forum/${forum.slug}`}
                className="block focus:ring-2 focus:ring-primary focus:outline-none"
            >
                <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row gap-4 p-5">
                        {/* Left: Image (if exists) */}
                        {forum.image && (
                            <div className="md:w-48 flex-shrink-0">
                                <img
                                    src={forum.image}
                                    alt={`Cover forum ${forum.title}`}
                                    className="w-full h-32 md:h-full object-cover rounded-lg"
                                />
                            </div>
                        )}

                        {/* Right: Content */}
                        <div className="flex-1 space-y-3">
                            {/* Header with Category and Author */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                    {forum.category.name}
                                </Badge>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    {forum.user.avatar ? (
                                        <img
                                            src={forum.user.avatar}
                                            alt={forum.user.name}
                                            className="h-5 w-5 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-[10px] font-medium text-primary">
                                                {forum.user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <span>{forum.user.name}</span>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{new Date(forum.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold leading-tight text-pretty line-clamp-2 hover:text-primary transition-colors">
                                {forum.title}
                            </h3>

                            {/* Description */}
                            <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                                {forum.description}
                            </p>

                            {/* Footer with Tags and Stats */}
                            <div className="flex items-center justify-between pt-2">
                                {/* Tags */}
                                {forum.tags && Array.isArray(forum.tags) && forum.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {forum.tags.slice(0, 4).map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted/80"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                        {forum.tags.length > 4 && (
                                            <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                                                +{forum.tags.length - 4}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm text-muted-foreground ml-auto">
                                    <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                                        <Heart className="h-4 w-4" />
                                        <span className="font-medium">{forum.likes_count}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                                        <MessageCircle className="h-4 w-4" />
                                        <span className="font-medium">{forum.comments_count}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}
