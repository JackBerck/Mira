import { ChatMain } from '@/components/chat/chat-main';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

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

interface ChatPageProps {
    collaborations: Collaboration[];
}

export default function Home({ collaborations }: ChatPageProps) {
    const [activeCollaborationId, setActiveCollaborationId] = useState<
        number | null
    >(collaborations.length > 0 ? collaborations[0].id : null);

    return (
        <AppLayout>
            <Head title="Pesan" />
            <div className="flex h-screen">
                <ChatSidebar
                    collaborations={collaborations}
                    activeCollaborationId={activeCollaborationId}
                    onSelectCollaboration={setActiveCollaborationId}
                />
                <ChatMain collaborationId={activeCollaborationId} />
            </div>
        </AppLayout>
    );
}
