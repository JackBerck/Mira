import ChatPanel from '@/components/idea-insight/chat-panel';
import Layout from '@/layouts';
import { IdeaInsight } from '@/types';
import { Head } from '@inertiajs/react';

interface IdeaInsightProps {
    userIdeaChat: IdeaInsight[];
}

export default function MariBerpikirPage({userIdeaChat}: IdeaInsightProps) {
    return (
        <Layout>
            <Head title="Mari Berpikir" />
            <main className="section-padding-x min-h-dvh bg-background py-4 text-foreground md:py-8">
                <section className="container max-w-screen-xl">
                    <ChatPanel userIdeaChat={userIdeaChat} />
                </section>
            </main>
        </Layout>
    );
}
