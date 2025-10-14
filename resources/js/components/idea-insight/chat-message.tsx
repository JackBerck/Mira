import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMessage({
    isAiGenerated,
    message,
}: {
    isAiGenerated?: boolean;
    message: string;
}) {
    const isUser = !isAiGenerated;

    return (
        <div
            className={cn(
                'max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap',
                isUser
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'mr-auto bg-muted text-foreground',
            )}
            aria-live="polite"
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
        </div>
    );
}
