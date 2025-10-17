import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link, router, usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import {
    Bell,
    CheckCheck,
    Heart,
    Inbox,
    MessageCircle,
    Users,
} from 'lucide-react';

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
        added_by_name?: string;
        added_by_avatar?: string;
        role?: string;
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
        case 'added_to_collaboration':
            return <Users className="h-5 w-5 text-indigo-500" />;
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

    const avatar =
        data.liker_avatar ||
        data.commenter_avatar ||
        data.requester_avatar ||
        data.added_by_avatar;
    const name =
        data.liker_name ||
        data.commenter_name ||
        data.requester_name ||
        data.added_by_name;

    return (
        <Card
            className={`border-0 shadow-sm transition-all hover:shadow-md ${
                !notification.read_at
                    ? 'border-l-4 border-l-primary bg-primary/5'
                    : ''
            }`}
        >
            <CardContent className="p-4">
                <Link href={href} className="flex gap-4">
                    <div className="flex-shrink-0">
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={name || 'User'}
                                className="h-12 w-12 rounded-full object-cover ring-2 ring-background"
                            />
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 ring-2 ring-background">
                                <NotificationIcon type={data.type} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-2">
                        <p className="text-sm leading-relaxed text-foreground">
                            {data.message}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(
                                    new Date(notification.created_at),
                                    {
                                        addSuffix: true,
                                        locale: id,
                                    },
                                )}
                            </span>
                            {!notification.read_at && (
                                <Badge variant="default" className="text-xs">
                                    Baru
                                </Badge>
                            )}
                        </div>
                    </div>
                </Link>
            </CardContent>
        </Card>
    );
}

export default function NotificationPage() {
    const { notifications } = usePage<PageProps>().props;

    const handleMarkAllRead = () => {
        router.post(
            '/notifikasi/mark-all-read',
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const unreadCount = notifications.data.filter((n) => !n.read_at).length;

    return (
        <AppLayout>
            {/* Consistent Layout with Dashboard */}
            <div className="flex h-full flex-1 flex-col section-padding-x py-8">
                <div className="container max-w-screen-xl">
                    {/* Header - Matching Dashboard Style */}
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Bell className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">
                                        Notifikasi
                                    </h1>
                                    <p className="text-muted-foreground">
                                        {unreadCount > 0
                                            ? `${unreadCount} notifikasi belum dibaca`
                                            : 'Semua notifikasi telah dibaca'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {notifications.data.length > 0 && unreadCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleMarkAllRead}
                                className="gap-2"
                            >
                                <CheckCheck className="h-4 w-4" />
                                Tandai Semua Dibaca
                            </Button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-3">
                        {notifications.data.length === 0 ? (
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-12 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                        <Inbox className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                                        Tidak ada notifikasi
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Anda akan menerima notifikasi di sini
                                        ketika ada aktivitas baru
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {/* Unread Notifications */}
                                {unreadCount > 0 && (
                                    <div className="space-y-3">
                                        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                            Belum Dibaca ({unreadCount})
                                        </h2>
                                        {notifications.data
                                            .filter((n) => !n.read_at)
                                            .map((notification) => (
                                                <NotificationItem
                                                    key={notification.id}
                                                    notification={notification}
                                                />
                                            ))}
                                    </div>
                                )}

                                {/* Read Notifications */}
                                {notifications.data.filter((n) => n.read_at)
                                    .length > 0 && (
                                    <div className="mt-6 space-y-3">
                                        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                            Sudah Dibaca
                                        </h2>
                                        {notifications.data
                                            .filter((n) => n.read_at)
                                            .map((notification) => (
                                                <NotificationItem
                                                    key={notification.id}
                                                    notification={notification}
                                                />
                                            ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
