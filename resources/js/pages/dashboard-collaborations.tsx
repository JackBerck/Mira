import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CollabListItem } from '@/components/collab/collab-list-item';
import type { Collab } from '@/components/collab/collab-types';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader2, ArrowLeft, Plus } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface DashboardCollaborationsProps {
    collaborations: PaginatedData<Collab>;
    sidebar: {
        popularCategories: Array<{ name: string; slug: string; count: number }>;
        statusCounts: {
            open: number;
            in_progress: number;
            completed: number;
        };
        stats: {
            totalCollaborations: number;
            activeMembers: number;
            thisMonth: number;
        };
    };
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

export default function DashboardCollaborations({ collaborations: initialCollaborations, sidebar }: DashboardCollaborationsProps) {
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
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Temukan Kolaborasi
                            </h1>
                            <p className="mt-2 text-muted-foreground">
                                Jelajahi forum dan kolaborasi dari komunitas kita
                            </p>
                        </div>
                        <Link href="/beranda/kolaborasi/buat">
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create Collaboration
                            </Button>
                        </Link>
                    </div>

                    {/* Main Content - Split Layout */}
                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Left Content - 3/4 width - Scrollable List */}
                        <div className="flex-1 lg:w-3/4">
                            {/* Navigation Tabs */}
                            <div className="mb-4 flex items-center justify-between border-b border-border">
                                <div className="flex gap-1">
                                    <Link
                                        href="/beranda"
                                        className="border-b-2 border-transparent px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                                    >
                                        <ArrowLeft className="mr-2 inline-block h-4 w-4" />
                                        Forum
                                    </Link>
                                    <button className="border-b-2 border-primary px-5 py-2.5 text-sm font-medium text-primary">
                                        Collaboration (
                                        {initialCollaborations.total})
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
                                        <div className="py-6 text-center text-muted-foreground">
                                            <p className="text-sm">
                                                No more collaborations to load
                                            </p>
                                        </div>
                                    }
                                >
                                    <div className="space-y-3">
                                        {collabs.map((collab) => (
                                            <CollabListItem
                                                key={collab.id}
                                                collab={collab}
                                            />
                                        ))}
                                    </div>
                                </InfiniteScroll>
                            </div>
                        </div>

                        {/* Right Sidebar - 1/4 width - Info Panel */}
                        <aside className="space-y-4 lg:w-1/4">
                            {/* Popular Categories */}
                            {sidebar.popularCategories &&
                                sidebar.popularCategories.length > 0 && (
                                    <div className="sticky top-4 rounded-lg border border-border bg-card p-4">
                                        <h3 className="mb-3 text-base font-semibold">
                                            Popular Categories
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {sidebar.popularCategories.map(
                                                (category) => (
                                                    <button
                                                        key={category.slug}
                                                        className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                                                    >
                                                        {category.name}
                                                        <span className="ml-1.5 text-[10px] opacity-70">
                                                            ({category.count})
                                                        </span>
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* Status Filter */}
                            <div className="rounded-lg border border-border bg-card p-4">
                                <h3 className="mb-3 text-base font-semibold">
                                    By Status
                                </h3>
                                <div className="space-y-1.5">
                                    <button className="group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left transition-colors hover:bg-muted">
                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                            Open
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {sidebar.statusCounts.open}
                                        </span>
                                    </button>
                                    <button className="group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left transition-colors hover:bg-muted">
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            In Progress
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {sidebar.statusCounts.in_progress}
                                        </span>
                                    </button>
                                    <button className="group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left transition-colors hover:bg-muted">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Completed
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {sidebar.statusCounts.completed}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="rounded-lg border border-border bg-card p-4">
                                <h3 className="mb-3 text-base font-semibold">
                                    Collaboration Stats
                                </h3>
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Total Projects
                                        </span>
                                        <span className="text-base font-bold">
                                            {sidebar.stats.totalCollaborations.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Active Members
                                        </span>
                                        <span className="text-base font-bold">
                                            {sidebar.stats.activeMembers.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            This Month
                                        </span>
                                        <span className="text-base font-bold">
                                            +
                                            {sidebar.stats.thisMonth.toLocaleString()}
                                        </span>
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
