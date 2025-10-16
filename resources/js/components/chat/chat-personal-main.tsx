'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { ArrowRight, User as UserIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Message {
    id: number;
    message: string;
    sender_id: number;
    receiver_id: number;
    sender: {
        id: number;
        name: string;
        email: string;
        image?: string;
    };
    receiver: {
        id: number;
        name: string;
        email: string;
        image?: string;
    };
    created_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    image?: string;
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
                <AvatarImage
                    src={message.sender.image || '/placeholder.svg'}
                    alt="User Avatar"
                />
                <AvatarFallback>
                    {message.sender.name.charAt(0)}
                </AvatarFallback>
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
                    {message.sender.name}
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

interface ChatPersonalMainProps {
    userId: number | null;
}

export function ChatPersonalMain({ userId }: ChatPersonalMainProps) {
    const page = usePage();
    const auth = (page.props as unknown as { auth: { user: { id: number } } })
        .auth;
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUser, setOtherUser] = useState<User | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = useCallback(async () => {
        if (!userId) return;

        try {
            const response = await axios.get(
                `/direct-messages/${userId}/messages`,
            );
            setMessages(response.data.messages);
            setOtherUser(response.data.user);
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        } else {
            setMessages([]);
            setOtherUser(null);
        }
    }, [userId, fetchMessages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !userId) return;

        try {
            const response = await axios.post('/direct-messages', {
                receiver_id: userId,
                message: newMessage,
            });

            setMessages((prev) => [...prev, response.data.message]);
            setNewMessage('');
            scrollToBottom();
            inputRef.current?.focus();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!userId) {
        return (
            <div className="flex flex-1 flex-col">
                <div className="flex flex-1 items-center justify-center">
                    <div className="text-center">
                        <UserIcon className="mx-auto h-16 w-16 text-muted-foreground" />
                        <p className="mt-4 text-lg font-medium text-muted-foreground">
                            Pilih percakapan untuk memulai
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Pilih pengguna dari daftar di samping untuk melihat
                            pesan
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 border-b p-4">
                <Avatar>
                    <AvatarImage
                        src={otherUser?.image || '/placeholder.svg'}
                        alt={otherUser?.name}
                    />
                    <AvatarFallback>
                        {otherUser?.name.charAt(0) || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h2 className="font-semibold">
                        {otherUser?.name || 'Loading...'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {otherUser?.email}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                            Belum ada pesan. Mulai percakapan!
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isUserMessage={message.sender_id === auth.user.id}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleSendMessage}
                className="flex gap-2 border-t p-4"
            >
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Ketik pesan..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                    <ArrowRight className="h-5 w-5" />
                </Button>
            </form>
        </div>
    );
}
