import ChatPanel from '@/components/idea-insight/chat-panel';
import AppLayout from '@/layouts/app-layout';
import { IdeaInsight } from '@/types';
import { Head } from '@inertiajs/react';
import { Lightbulb } from 'lucide-react';

interface IdeaInsightProps {
    userIdeaChat: IdeaInsight[];
}

export default function MariBerpikirPage({ userIdeaChat }: IdeaInsightProps) {
    return (
        <AppLayout>
            <Head title="Mari Berpikir" />

            {/* Consistent Layout with Dashboard */}
            <div className="section-padding-x flex h-full flex-1 flex-col py-8">
                <div className="container max-w-screen-xl">
                    {/* Header - Matching Dashboard Style */}
                    <div className="mb-8">
                        <div className="mb-2 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Lightbulb className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">
                                    Mari Berpikir
                                </h1>
                                <p className="text-muted-foreground">
                                    AI Idea Companion untuk mengeksplorasi ide,
                                    menyusun langkah, dan menyiapkan aksi
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Panel - Full Width on Large Screens */}
                    <div className="container max-w-screen-xl">
                        <ChatPanel userIdeaChat={userIdeaChat} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
