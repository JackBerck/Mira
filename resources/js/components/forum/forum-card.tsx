import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { MessageCircle, Heart } from 'lucide-react';
import type { Forum } from './forum-types';

export function ForumCard({ forum }: { forum: Forum }) {
    return (
        <Card className="overflow-hidden border bg-card text-card-foreground hover:border-primary/50 transition-colors">
            <Link
                href={`/forum/${forum.slug}`}
                className="block focus:ring-2 focus:ring-primary focus:outline-none"
            >
                <CardHeader className="p-0">
                    {forum.image && (
                        <img
                            src={forum.image}
                            alt={`Cover forum ${forum.title}`}
                            className="h-48 w-full object-cover"
                        />
                    )}
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                            {forum.category.name}
                        </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold leading-tight text-pretty line-clamp-2">
                        {forum.title}
                    </h3>

                    {/* Description */}
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                        {forum.description}
                    </p>

                    {/* Tags */}
                    {forum.tags && Array.isArray(forum.tags) && forum.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {forum.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
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

                    {/* Footer with author and stats */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-2">
                            {forum.user.avatar ? (
                                <img
                                    src={forum.user.avatar}
                                    alt={forum.user.name}
                                    className="h-6 w-6 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xs font-medium text-primary">
                                        {forum.user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <span className="text-xs text-muted-foreground">
                                {forum.user.name}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Heart className="h-3.5 w-3.5" />
                                <span>{forum.likes_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageCircle className="h-3.5 w-3.5" />
                                <span>{forum.comments_count}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}
