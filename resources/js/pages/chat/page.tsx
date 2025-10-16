import { ChatMain } from '@/components/chat/chat-main';
import { ChatPersonalMain } from '@/components/chat/chat-personal-main';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
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

interface ChatPageProps {
    collaborations: Collaboration[];
}

export default function Home({ collaborations }: ChatPageProps) {
    // Check URL parameters for initial state
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab') === 'personal' ? 'personal' : 'groups';
    const initialUserId = urlParams.get('user') ? parseInt(urlParams.get('user')!) : null;

    const [activeTab, setActiveTab] = useState<'groups' | 'personal'>(initialTab);
    const [activeCollaborationId, setActiveCollaborationId] = useState<
        number | null
    >(initialTab === 'groups' && collaborations.length > 0 ? collaborations[0].id : null);
    const [activeUserId, setActiveUserId] = useState<number | null>(initialUserId);

    useEffect(() => {
        // If we have a user ID from URL, ensure we're on the personal tab
        if (initialUserId) {
            setActiveTab('personal');
            setActiveUserId(initialUserId);
            setActiveCollaborationId(null);
        }
    }, [initialUserId]);

    const handleTabChange = (tab: 'groups' | 'personal') => {
        setActiveTab(tab);
        // Reset active selections when switching tabs
        if (tab === 'groups') {
            setActiveUserId(null);
            if (collaborations.length > 0) {
                setActiveCollaborationId(collaborations[0].id);
            }
        } else {
            setActiveCollaborationId(null);
        }
    };

    return (
        <AppLayout>
            <Head title="Pesan" />
            <div className="flex h-screen">
                <ChatSidebar
                    collaborations={collaborations}
                    activeCollaborationId={activeCollaborationId}
                    onSelectCollaboration={setActiveCollaborationId}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    activeUserId={activeUserId}
                    onSelectUser={setActiveUserId}
                />
                {activeTab === 'groups' ? (
                    <ChatMain collaborationId={activeCollaborationId} />
                ) : (
                    <ChatPersonalMain userId={activeUserId} />
                )}
            </div>
        </AppLayout>
    );
}
