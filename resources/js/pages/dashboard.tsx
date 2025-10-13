import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ForumListItem } from '@/components/forum/forum-list-item';
import type { Forum } from '@/components/forum/forum-types';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface DashboardProps {
    forums: PaginatedData<Forum>;
    sidebar: {
        popularTags: string[];
        trendingTopics: Array<{ title: string; slug: string; count: number }>;
        stats: {
            totalForums: number;
            totalCollaborations: number;
            totalMembers: number;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ forums: initialForums, sidebar }: DashboardProps) {
    const [forums, setForums] = useState<Forum[]>(initialForums.data);
    const [forumsPage, setForumsPage] = useState(initialForums.current_page);
    const [forumsHasMore, setForumsHasMore] = useState(initialForums.current_page < initialForums.last_page);
    const [isLoadingForums, setIsLoadingForums] = useState(false);

    const loadMoreForums = async () => {
        if (isLoadingForums) return;
        
        setIsLoadingForums(true);
        const nextPage = forumsPage + 1;

        try {
            const response = await axios.get(dashboard().url, {
                params: { page: nextPage },
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Inertia': 'true',
                    'X-Inertia-Version': (window as unknown as { appVersion?: string }).appVersion || '',
                },
            });
            
            if (response.data.props.forums) {
                setForums(prev => [...prev, ...response.data.props.forums.data]);
                setForumsPage(response.data.props.forums.current_page);
                setForumsHasMore(response.data.props.forums.current_page < response.data.props.forums.last_page);
            }
        } catch (error) {
            console.error('Error loading more forums:', error);
        } finally {
            setIsLoadingForums(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
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
                                    <button className="px-5 py-2.5 text-sm font-medium border-b-2 border-primary text-primary">
                                        Forum ({initialForums.total})
                                    </button>
                                    <Link
                                        href="/beranda/kolaborasi"
                                        className="px-5 py-2.5 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                                    >
                                        Collaboration
                                        <ArrowRight className="inline-block ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Forum List with Infinite Scroll */}
                            <div className="space-y-3">
                                <InfiniteScroll
                                    dataLength={forums.length}
                                    next={loadMoreForums}
                                    hasMore={forumsHasMore}
                                    loader={
                                        <div className="flex justify-center py-6">
                                            <Loader2 className="h-7 w-7 animate-spin text-primary" />
                                        </div>
                                    }
                                    endMessage={
                                        <div className="text-center py-6 text-muted-foreground">
                                            <p className="text-sm">No more forums to load</p>
                                        </div>
                                    }
                                >
                                    <div className="space-y-3">
                                        {forums.map((forum) => (
                                            <ForumListItem key={forum.id} forum={forum} />
                                        ))}
                                    </div>
                                </InfiniteScroll>
                            </div>
                        </div>

                        {/* Right Sidebar - 1/4 width - Info Panel */}
                        <aside className="lg:w-1/4 space-y-4">
                            {/* Popular Tags */}
                            <div className="rounded-lg border border-border bg-card p-4 sticky top-4">
                                <h3 className="text-base font-semibold mb-3">
                                    Popular Tags
                                </h3>
                                {sidebar?.popularTags && sidebar.popularTags.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {sidebar.popularTags.map((tag, index) => (
                                            <button
                                                key={`${tag}-${index}`}
                                                className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                #{tag}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground">No tags available yet</p>
                                )}
                            </div>

                            {/* Trending Topics */}
                            {sidebar.trendingTopics && sidebar.trendingTopics.length > 0 && (
                                <div className="rounded-lg border border-border bg-card p-4">
                                    <h3 className="text-base font-semibold mb-3">
                                        Trending Topics
                                    </h3>
                                    <div className="space-y-2.5">
                                        {sidebar.trendingTopics.map((topic, index) => (
                                            <Link
                                                key={topic.slug}
                                                href={`/forum/${topic.slug}`}
                                                className="flex items-start gap-2 w-full text-left hover:text-primary transition-colors group"
                                            >
                                                <span className="text-base font-bold text-muted-foreground group-hover:text-primary min-w-[20px]">
                                                    {index + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium leading-tight line-clamp-2">
                                                        {topic.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {topic.count} interactions
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Stats */}
                            <div className="rounded-lg border border-border bg-card p-4">
                                <h3 className="text-base font-semibold mb-3">
                                    Community Stats
                                </h3>
                                <div className="space-y-2.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total Forums</span>
                                        <span className="text-base font-bold">{sidebar.stats.totalForums.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Active Collabs</span>
                                        <span className="text-base font-bold">{sidebar.stats.totalCollaborations.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Members</span>
                                        <span className="text-base font-bold">{sidebar.stats.totalMembers.toLocaleString()}</span>
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
