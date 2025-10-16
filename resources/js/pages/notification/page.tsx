import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';
import { Bell, CheckCheck, Heart, MessageCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface Notification {
    id: string;
    type: string;
    data: {
        type: string;
        message: string;
        forum_id?: number;
        forum_title?: string;
        forum_slug?: string;
        collaboration_id?: number;
        collaboration_title?: string;
        collaboration_slug?: string;
        join_request_id?: number;
        liker_name?: string;
        liker_avatar?: string;
        commenter_name?: string;
        commenter_avatar?: string;
        requester_name?: string;
        requester_avatar?: string;
        status?: string;
    };
    read_at: string | null;
    created_at: string;
}

interface PageProps extends Record<string, unknown> {
    notifications: {
        data: Notification[];
        links: Record<string, unknown>;
        meta: Record<string, unknown>;
    };
}

function NotificationIcon({ type }: { type: string }) {
    switch (type) {
        case 'forum_liked':
            return <Heart className="h-5 w-5 text-red-500" />;
        case 'forum_commented':
            return <MessageCircle className="h-5 w-5 text-blue-500" />;
        case 'collaboration_join_request':
            return <Users className="h-5 w-5 text-green-500" />;
        case 'join_request_response':
            return <CheckCheck className="h-5 w-5 text-purple-500" />;
        default:
            return <Bell className="h-5 w-5 text-gray-500" />;
    }
}

function NotificationItem({ notification }: { notification: Notification }) {
    const { data } = notification;
    
    let href = '#';
    if (data.forum_slug) {
        href = `/beranda/forum/${data.forum_slug}`;
    } else if (data.collaboration_slug) {
        href = `/beranda/kolaborasi/${data.collaboration_slug}`;
    }

    const avatar = data.liker_avatar || data.commenter_avatar || data.requester_avatar;
    const name = data.liker_name || data.commenter_name || data.requester_name;

    return (
        <Card
            className={`p-4 transition-colors hover:bg-muted/50 ${
                !notification.read_at ? 'border-l-4 border-l-primary bg-primary/5' : ''
            }`}
        >
            <Link href={href} className="flex gap-4">
                <div className="flex-shrink-0">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={name || 'User'}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <NotificationIcon type={data.type} />
                        </div>
                    )}
                </div>
                
                <div className="flex-1 space-y-1">
                    <p className="text-sm">{data.message}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                                locale: id,
                            })}
                        </span>
                        {!notification.read_at && (
                            <Badge variant="secondary" className="text-xs">
                                Baru
                            </Badge>
                        )}
                    </div>
                </div>
            </Link>
        </Card>
    );
}

export default function NotificationPage() {
    const { notifications } = usePage<PageProps>().props;

    return (
        <AppLayout>
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Notifikasi</h1>
                    {notifications.data.length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                        >
                            <Link
                                href="/notifikasi/mark-all-read"
                                method="post"
                                as="button"
                            >
                                <CheckCheck className="mr-2 h-4 w-4" />
                                Tandai Semua Dibaca
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="space-y-3">
                    {notifications.data.length === 0 ? (
                        <Card className="p-12 text-center">
                            <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">
                                Tidak ada notifikasi
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Anda akan menerima notifikasi di sini
                            </p>
                        </Card>
                    ) : (
                        notifications.data.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                            />
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
