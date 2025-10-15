import ChatPanel from '@/components/idea-insight/chat-panel';
import AppLayout from '@/layouts/app-layout';
import { IdeaInsight } from '@/types';
import { Head } from '@inertiajs/react';

interface IdeaInsightProps {
    userIdeaChat: IdeaInsight[];
}

export default function MariBerpikirPage({ userIdeaChat }: IdeaInsightProps) {
    return (
        <AppLayout>
            <Head title="Mari Berpikir" />
            <main className="section-padding-x min-h-dvh bg-background py-4 text-foreground md:py-8">
                <section className="container max-w-screen-xl">
                    <div className="mb-4">
                        <h1 className="text-3xl font-semibold tracking-tight text-pretty md:text-4xl">
                            Mari Berpikir
                        </h1>
                        <p className="mt-2 text-muted-foreground md:text-base">
                            {
                                'AI Idea Companion untuk mengeksplorasi ide, menyusun langkah, dan menyiapkan aksi.'
                            }
                        </p>
                    </div>
                    <ChatPanel userIdeaChat={userIdeaChat} />
                </section>
            </main>
        </AppLayout>
    );
}
