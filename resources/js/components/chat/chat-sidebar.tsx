'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';

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

interface ChatSidebarProps {
    collaborations: Collaboration[];
    activeCollaborationId: number | null;
    onSelectCollaboration: (id: number) => void;
}

const CollaborationItem = ({
    collaboration,
    isActive,
    onClick,
}: {
    collaboration: Collaboration;
    isActive: boolean;
    onClick: () => void;
}) => {
    const memberCount = collaboration.collaborators.length + 1; // +1 for owner

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
                    src={collaboration.image || '/placeholder.svg'}
                    alt={collaboration.title}
                />
                <AvatarFallback>
                    <Users className="h-5 w-5" />
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                    <span className="truncate font-medium">
                        {collaboration.title}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{memberCount} anggota</span>
                </div>
            </div>
        </div>
    );
};

export function ChatSidebar({
    collaborations,
    activeCollaborationId,
    onSelectCollaboration,
}: ChatSidebarProps) {
    return (
        <div className="flex w-80 flex-col border border-r p-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Chat Kolaborasi</h1>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto pr-2">
                {collaborations.length === 0 ? (
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
                        />
                    ))
                )}
            </div>
        </div>
    );
}
