'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Collaboration {
    id: number;
    title: string;
    slug: string;
    description: string;
    status: string;
    image?: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    collaborators: Array<{
        id: number;
        user: {
            id: number;
            name: string;
            email: string;
        };
    }>;
}

interface DirectMessageUser {
    user: {
        id: number;
        name: string;
        email: string;
        image?: string;
    };
    last_message?: {
        id: number;
        message: string;
        created_at: string;
    };
    unread_count: number;
}

interface ChatSidebarProps {
    collaborations: Collaboration[];
    activeCollaborationId: number | null;
    onSelectCollaboration: (id: number) => void;
    activeTab: 'groups' | 'personal';
    onTabChange: (tab: 'groups' | 'personal') => void;
    activeUserId: number | null;
    onSelectUser: (id: number) => void;
}

const CollaborationItem = ({
    collaboration,
    isActive,
    onClick,
    unreadCount,
    pendingRequestsCount,
}: {
    collaboration: Collaboration;
    isActive: boolean;
    onClick: () => void;
    unreadCount?: number;
    pendingRequestsCount?: number;
}) => {
    const memberCount = collaboration.collaborators.length + 1; // +1 for owner
    const totalBadgeCount = (unreadCount || 0) + (pendingRequestsCount || 0);

    // Debug log
    if (pendingRequestsCount || unreadCount) {
        console.log(`🔴 Badge for ${collaboration.title}:`, {
            unreadCount,
            pendingRequestsCount,
            totalBadgeCount,
        });
    }

    return (
        <div
            className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted',
                isActive && 'bg-muted',
            )}
            onClick={onClick}
        >
            <div className="relative">
                <Avatar>
                    <AvatarImage
                        src={collaboration.image || '/placeholder.svg'}
                        alt={collaboration.title}
                    />
                    <AvatarFallback>
                        <Users className="h-5 w-5" />
                    </AvatarFallback>
                </Avatar>
                {totalBadgeCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                        {totalBadgeCount > 9 ? '9+' : totalBadgeCount}
                    </span>
                )}
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                    <span className="truncate font-medium">
                        {collaboration.title}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{memberCount} anggota</span>
                    </div>
                    {pendingRequestsCount && pendingRequestsCount > 0 && (
                        <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-200">
                            {pendingRequestsCount} permintaan
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const UserItem = ({
    conversation,
    isActive,
    onClick,
}: {
    conversation: DirectMessageUser;
    isActive: boolean;
    onClick: () => void;
}) => {
    return (
        <div
            className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted',
                isActive && 'bg-muted',
            )}
            onClick={onClick}
        >
            <Avatar>
                <AvatarImage
                    src={conversation.user.image || '/placeholder.svg'}
                    alt={conversation.user.name}
                />
                <AvatarFallback>
                    {conversation.user.name.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                    <span className="truncate font-medium">
                        {conversation.user.name}
                    </span>
                    {conversation.unread_count > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {conversation.unread_count}
                        </span>
                    )}
                </div>
                {conversation.last_message && (
                    <p className="truncate text-sm text-muted-foreground">
                        {conversation.last_message.message}
                    </p>
                )}
            </div>
        </div>
    );
};

export function ChatSidebar({
    collaborations,
    activeCollaborationId,
    onSelectCollaboration,
    activeTab,
    onTabChange,
    activeUserId,
    onSelectUser,
}: ChatSidebarProps) {
    const [conversations, setConversations] = useState<DirectMessageUser[]>(
        [],
    );
    const [loading, setLoading] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
    const [pendingRequestsCounts, setPendingRequestsCounts] = useState<Record<number, number>>({});

    useEffect(() => {
        if (activeTab === 'personal') {
            fetchConversations();
            const interval = setInterval(fetchConversations, 5000);
            return () => clearInterval(interval);
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'groups' && collaborations.length > 0) {
            fetchCollaborationStats();
            const interval = setInterval(fetchCollaborationStats, 10000); // Every 10 seconds
            return () => clearInterval(interval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, collaborations.length]);

    const fetchConversations = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/direct-messages/conversations');
            setConversations(response.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCollaborationStats = async () => {
        try {
            console.log('📊 Fetching collaboration stats for', collaborations.length, 'collaborations');
            
            // Fetch unread counts and pending requests for all collaborations
            const statsPromises = collaborations.map(async (collab) => {
                try {
                    const [unreadResponse, pendingResponse] = await Promise.all([
                        axios.get(`/pesan/${collab.id}/unread-count`),
                        axios.get(`/kolaborasi/${collab.id}/pending-requests`),
                    ]);
                    
                    console.log(`📈 Stats for ${collab.title}:`, {
                        unread: unreadResponse.data.count,
                        pending: pendingResponse.data.requests?.length,
                    });
                    
                    return {
                        id: collab.id,
                        unreadCount: unreadResponse.data.count || 0,
                        pendingCount: pendingResponse.data.requests?.length || 0,
                    };
                } catch (err) {
                    console.error(`❌ Error fetching stats for ${collab.title}:`, err);
                    return {
                        id: collab.id,
                        unreadCount: 0,
                        pendingCount: 0,
                    };
                }
            });

            const stats = await Promise.all(statsPromises);
            
            const newUnreadCounts: Record<number, number> = {};
            const newPendingCounts: Record<number, number> = {};
            
            stats.forEach((stat) => {
                newUnreadCounts[stat.id] = stat.unreadCount;
                newPendingCounts[stat.id] = stat.pendingCount;
            });

            console.log('✅ Final counts:', { 
                unread: newUnreadCounts, 
                pending: newPendingCounts 
            });

            setUnreadCounts(newUnreadCounts);
            setPendingRequestsCounts(newPendingCounts);
        } catch (error) {
            console.error('❌ Error fetching collaboration stats:', error);
        }
    };

    return (
        <div className="flex w-80 flex-col border border-r p-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Chat Kolaborasi</h1>
            </div>

            <div className="mb-6 flex rounded-lg border p-1">
                <Button
                    variant="ghost"
                    className={cn(
                        'h-9 flex-1 rounded-md text-sm font-medium',
                        activeTab === 'groups'
                            ? 'shadow-sm'
                            : 'text-muted-foreground hover:bg-transparent',
                    )}
                    onClick={() => onTabChange('groups')}
                >
                    <Users className="mr-2 h-4 w-4" />
                    Groups
                </Button>
                <Button
                    variant="ghost"
                    className={cn(
                        'h-9 flex-1 rounded-md text-sm font-medium',
                        activeTab === 'personal'
                            ? 'shadow-sm'
                            : 'text-muted-foreground hover:bg-transparent',
                    )}
                    onClick={() => onTabChange('personal')}
                >
                    <User className="mr-2 h-4 w-4" />
                    Personal
                </Button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto pr-2">
                {activeTab === 'groups' ? (
                    collaborations.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                            <p>
                                Belum ada kolaborasi.
                                <br />
                                Bergabung atau buat kolaborasi baru!
                            </p>
                        </div>
                    ) : (
                        collaborations.map((collaboration) => (
                            <CollaborationItem
                                key={collaboration.id}
                                collaboration={collaboration}
                                isActive={
                                    collaboration.id === activeCollaborationId
                                }
                                onClick={() =>
                                    onSelectCollaboration(collaboration.id)
                                }
                                unreadCount={unreadCounts[collaboration.id]}
                                pendingRequestsCount={pendingRequestsCounts[collaboration.id]}
                            />
                        ))
                    )
                ) : loading ? (
                    <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                        <p>Memuat percakapan...</p>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                        <p>
                            Belum ada percakapan.
                            <br />
                            Kirim pesan pertama Anda!
                        </p>
                    </div>
                ) : (
                    conversations.map((conversation) => (
                        <UserItem
                            key={conversation.user.id}
                            conversation={conversation}
                            isActive={conversation.user.id === activeUserId}
                            onClick={() => onSelectUser(conversation.user.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
