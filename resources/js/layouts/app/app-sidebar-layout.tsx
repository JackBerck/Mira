import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import Footer from '@/components/footer';
import { TopNavbar } from '@/components/navigation-bar/top';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <>
            <AppShell variant="sidebar">
                <AppSidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <TopNavbar />
                    <AppContent variant="sidebar" className="overflow-x-hidden">
                        {children}
                    </AppContent>
                </div>
            </AppShell>
            <Footer />
        </>
    );
}
