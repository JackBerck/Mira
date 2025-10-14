import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import type { Collab } from './collab-types';

export function CollabCard({ collab }: { collab: Collab }) {
    return (
        <Card className="h-full border bg-card text-card-foreground">
            <Link
                href={`/kolaborasi/${collab.slug}`}
                className="block rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
            >
                <CardHeader className="p-0">
                    <img
                        src={collab.coverUrl || '/kolaborasi-cover.jpg'}
                        alt={`Cover kolaborasi ${collab.title}`}
                        className="h-40 w-full rounded-t-md object-cover"
                    />
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary">{collab.category}</Badge>
                        <Badge
                            className="capitalize"
                            variant={
                                collab.status === 'open'
                                    ? 'default'
                                    : 'secondary'
                            }
                        >
                            {collab.status.replace('-', ' ')}
                        </Badge>
                    </div>
                    <CardTitle className="text-base leading-tight text-pretty">
                        {collab.title}
                    </CardTitle>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                        {collab.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{collab.membersCount} anggota</span>
                        {collab.forumId ? (
                            <span className="underline underline-offset-4">
                                Dari forum #{collab.forumId}
                            </span>
                        ) : (
                            <span>Mandiri</span>
                        )}
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}
