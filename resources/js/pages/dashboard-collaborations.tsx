import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CollabListItem } from '@/components/collab/collab-list-item';
import type { Collab } from '@/components/collab/collab-types';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader2, ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface DashboardCollaborationsProps {
    collaborations: PaginatedData<Collab>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/beranda',
    },
    {
        title: 'Collaborations',
        href: '/beranda/kolaborasi',
    },
];

export default function DashboardCollaborations({ collaborations: initialCollaborations }: DashboardCollaborationsProps) {
    const [collabs, setCollabs] = useState<Collab[]>(initialCollaborations.data);
    const [collabsPage, setCollabsPage] = useState(initialCollaborations.current_page);
    const [collabsHasMore, setCollabsHasMore] = useState(initialCollaborations.current_page < initialCollaborations.last_page);
    const [isLoadingCollabs, setIsLoadingCollabs] = useState(false);

    const loadMoreCollabs = async () => {
        if (isLoadingCollabs) return;
        
        setIsLoadingCollabs(true);
        const nextPage = collabsPage + 1;

        try {
            const response = await axios.get('/beranda/kolaborasi', {
                params: { page: nextPage },
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Inertia': 'true',
                    'X-Inertia-Version': (window as unknown as { appVersion?: string }).appVersion || '',
                },
            });
            
            if (response.data.props.collaborations) {
                setCollabs(prev => [...prev, ...response.data.props.collaborations.data]);
                setCollabsPage(response.data.props.collaborations.current_page);
                setCollabsHasMore(response.data.props.collaborations.current_page < response.data.props.collaborations.last_page);
            }
        } catch (error) {
            console.error('Error loading more collaborations:', error);
        } finally {
            setIsLoadingCollabs(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collaborations - Dashboard" />
            
            {/* Medium-like Layout with Sidebar */}
            <div className="flex h-full flex-1 flex-col">
                <div className="mx-auto w-full max-w-7xl px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Discover
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Explore forums and collaborations from the community
                        </p>
                    </div>

                    {/* Main Content - Split Layout */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Content - 3/4 width - Scrollable List */}
                        <div className="flex-1 lg:w-3/4">
                            {/* Navigation Tabs */}
                            <div className="flex items-center justify-between mb-4 border-b border-border">
                                <div className="flex gap-1">
                                    <Link
                                        href="/beranda"
                                        className="px-5 py-2.5 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                                    >
                                        <ArrowLeft className="inline-block mr-2 h-4 w-4" />
                                        Forum
                                    </Link>
                                    <button className="px-5 py-2.5 text-sm font-medium border-b-2 border-primary text-primary">
                                        Collaboration ({initialCollaborations.total})
                                    </button>
                                </div>
                            </div>

                            {/* Collaboration List with Infinite Scroll */}
                            <div className="space-y-3">
                                <InfiniteScroll
                                    dataLength={collabs.length}
                                    next={loadMoreCollabs}
                                    hasMore={collabsHasMore}
                                    loader={
                                        <div className="flex justify-center py-6">
                                            <Loader2 className="h-7 w-7 animate-spin text-primary" />
                                        </div>
                                    }
                                    endMessage={
                                        <div className="text-center py-6 text-muted-foreground">
                                            <p className="text-sm">No more collaborations to load</p>
                                        </div>
                                    }
                                >
                                    <div className="space-y-3">
                                        {collabs.map((collab) => (
                                            <CollabListItem key={collab.id} collab={collab} />
                                        ))}
                                    </div>
                                </InfiniteScroll>
                            </div>
                        </div>

                        {/* Right Sidebar - 1/4 width - Info Panel */}
                        <aside className="lg:w-1/4 space-y-6">
                            {/* Popular Categories */}
                            <div className="rounded-xl border border-border bg-card p-6 sticky top-4">
                                <h3 className="text-lg font-semibold mb-4">
                                    Popular Categories
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Teknologi', 'Sosial', 'Kreatif', 'Lingkungan'].map((category) => (
                                        <button
                                            key={category}
                                            className="inline-flex items-center rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="rounded-xl border border-border bg-card p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    By Status
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        { status: 'Open', count: 45, color: 'text-green-600' },
                                        { status: 'In Progress', count: 23, color: 'text-blue-600' },
                                        { status: 'Completed', count: 67, color: 'text-gray-600' },
                                    ].map((item) => (
                                        <button
                                            key={item.status}
                                            className="flex items-center justify-between w-full text-left hover:bg-muted px-3 py-2 rounded-md transition-colors group"
                                        >
                                            <span className={`text-sm font-medium ${item.color}`}>
                                                {item.status}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {item.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="rounded-xl border border-border bg-card p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Collaboration Stats
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total Projects</span>
                                        <span className="text-lg font-bold">{initialCollaborations.total}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Active Members</span>
                                        <span className="text-lg font-bold">234</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">This Month</span>
                                        <span className="text-lg font-bold">+12</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
