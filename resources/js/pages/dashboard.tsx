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
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ forums: initialForums }: DashboardProps) {
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
                        <aside className="lg:w-1/4 space-y-6">
                            {/* Popular Tags */}
                            <div className="rounded-xl border border-border bg-card p-6 sticky top-4">
                                <h3 className="text-lg font-semibold mb-4">
                                    Popular Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['web-development', 'laravel', 'react', 'database', 'api', 'mobile'].map((tag) => (
                                        <button
                                            key={tag}
                                            className="inline-flex items-center rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Trending Topics */}
                            <div className="rounded-xl border border-border bg-card p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Trending Topics
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { title: 'Best Practices Laravel 11', count: 234 },
                                        { title: 'React Server Components', count: 189 },
                                        { title: 'Database Optimization', count: 156 },
                                    ].map((topic, index) => (
                                        <button
                                            key={index}
                                            className="flex items-start gap-2 w-full text-left hover:text-primary transition-colors group"
                                        >
                                            <span className="text-lg font-bold text-muted-foreground group-hover:text-primary">
                                                {index + 1}
                                            </span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium leading-tight">
                                                    {topic.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {topic.count} discussions
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="rounded-xl border border-border bg-card p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Community Stats
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total Forums</span>
                                        <span className="text-lg font-bold">1,234</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Active Collabs</span>
                                        <span className="text-lg font-bold">89</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Members</span>
                                        <span className="text-lg font-bold">5,678</span>
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
