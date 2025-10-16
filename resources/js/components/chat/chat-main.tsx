import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { ArrowRight, Users } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Message {
    id: number;
    message: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
}

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

interface MessageBubbleProps {
    message: Message;
    isUserMessage: boolean;
}

const MessageBubble = ({ message, isUserMessage }: MessageBubbleProps) => (
    <div
        className={cn(
            'flex items-start gap-3',
            isUserMessage ? 'justify-end' : '',
        )}
    >
        {!isUserMessage && (
            <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User Avatar" />
                <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
        )}
        <div
            className={cn(
                'max-w-[70%] rounded-lg p-3',
                isUserMessage
                    ? 'rounded-br-none bg-primary text-primary-foreground'
                    : 'rounded-bl-none bg-muted',
            )}
        >
            {!isUserMessage && (
                <p className="mb-1 text-xs font-semibold">
                    {message.user.name}
                </p>
            )}
            <p className="text-sm">{message.message}</p>
            <p
                className={cn(
                    'mt-1 text-xs',
                    isUserMessage
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground',
                )}
            >
                {new Date(message.created_at).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </p>
        </div>
    </div>
);

interface ChatMainProps {
    collaborationId: number | null;
}

export function ChatMain({ collaborationId }: ChatMainProps) {
    const page = usePage();
    const auth = (page.props as unknown as { auth: { user: { id: number } } })
        .auth;
    const [messages, setMessages] = useState<Message[]>([]);
    const [collaboration, setCollaboration] = useState<Collaboration | null>(
        null,
    );
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadMessages = useCallback(async () => {
        if (!collaborationId) return;

        try {
            const response = await axios.get(
                `/pesan/${collaborationId}/messages`,
            );
            setMessages(response.data.messages);
            setCollaboration(response.data.collaboration);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }, [collaborationId]);

    useEffect(() => {
        if (collaborationId) {
            loadMessages();
        }
    }, [collaborationId, loadMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Subscribe to real-time updates
    useEffect(() => {
        if (!collaborationId) return;

        const channel = window.Echo.private(
            `collaboration.${collaborationId}`,
        );

        channel.listen(
            '.MessageSent',
            (e: {
                id: number;
                message: string;
                user: { id: number; name: string; email: string };
                created_at: string;
            }) => {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: e.id,
                        message: e.message,
                        user: e.user,
                        created_at: e.created_at,
                    },
                ]);
            },
        );

        return () => {
            channel.stopListening('.MessageSent');
            window.Echo.leave(`collaboration.${collaborationId}`);
        };
    }, [collaborationId]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !collaborationId || isLoading) return;

        setIsLoading(true);

        try {
            const response = await axios.post('/pesan', {
                message: newMessage,
                collaboration_id: collaborationId,
            });

            setMessages((prev) => [...prev, response.data.chat]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!collaborationId || !collaboration) {
        return (
            <div className="m-4 flex flex-1 flex-col items-center justify-center rounded-lg shadow-sm">
                <Users className="mb-4 h-16 w-16 text-muted-foreground" />
                <h2 className="text-xl font-semibold text-muted-foreground">
                    Pilih Kolaborasi
                </h2>
                <p className="text-sm text-muted-foreground">
                    Pilih kolaborasi dari sidebar untuk mulai chat
                </p>
            </div>
        );
    }

    const memberCount = collaboration.collaborators.length + 1;

    return (
        <div className="m-4 flex flex-1 flex-col rounded-lg shadow-sm">
            <div className="flex items-center justify-between border border-b p-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src={collaboration.image || '/placeholder.svg'}
                            alt={collaboration.title}
                        />
                        <AvatarFallback>
                            <Users className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-semibold">{collaboration.title}</h2>
                        <p className="text-sm text-muted-foreground">
                            {memberCount} anggota
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                        <p>Belum ada pesan. Mulai percakapan!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isUserMessage={msg.user.id === auth.user.id}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form
                onSubmit={sendMessage}
                className="flex items-center gap-3 border border-t p-4"
            >
                <Input
                    placeholder="Tulis pesan..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                    type="submit"
                    size="icon"
                    className="rounded-full"
                    disabled={!newMessage.trim() || isLoading}
                >
                    <ArrowRight />
                </Button>
            </form>
        </div>
    );
}
