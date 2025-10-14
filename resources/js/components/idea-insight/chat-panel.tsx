/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react';
import { useRef, useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { IdeaInsight } from '@/types';
import ChatMessage from './chat-message';
import ExportDialog from './export-dialog';
import getCsrfToken from '@/utils/get-csrf-token';

interface ChatPanelProps {
    userIdeaChat: IdeaInsight[];
}

const seedMessage: IdeaInsight = {
    id: 0,
    is_ai_generated: true,
    message: 'Halo! Saya AI Idea Companion Mira. Ceritakan ide atau tantanganmu, mari kita kembangkan menjadi aksi nyata.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 0,
};

export default function ChatPanel({ userIdeaChat }: ChatPanelProps) {
    // Initialize with seed if no existing messages
    const initialMessages = userIdeaChat && userIdeaChat.length > 0
        ? userIdeaChat
        : [seedMessage];

    const [messages, setMessages] = useState<IdeaInsight[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    // Auto scroll to bottom when messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        const value = input.trim();
        if (!value) return;

        const userMsg: IdeaInsight = {
            id: Date.now(), // Use timestamp for better uniqueness
            is_ai_generated: false,
            message: value,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: 0,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const csrfToken = getCsrfToken();
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };

            // Add CSRF token if available
            if (csrfToken) {
                headers['X-CSRF-TOKEN'] = csrfToken;
            }

            console.log('Sending messages:', [...messages, userMsg].map(m => ({
                message: m.message,
                is_ai_generated: m.is_ai_generated
            })));

            const res = await fetch('/api/think/chat', {
                method: 'POST',
                headers,
                credentials: 'same-origin',
                body: JSON.stringify({
                    messages: [...messages, userMsg].map((m) => ({
                        message: m.message,
                        // Tidak perlu kirim is_ai_generated karena backend bisa deteksi dari urutan
                    })),
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Response status:', res.status);
                console.error('Response text:', errorText);

                if (res.status === 401) {
                    throw new Error('Sesi login Anda telah berakhir. Silakan login kembali.');
                }
                if (res.status === 419) {
                    throw new Error('Token keamanan tidak valid. Silakan refresh halaman.');
                }
                throw new Error(`Gagal mendapatkan respons AI (Status: ${res.status})`);
            }

            // Simple text (non-stream) to keep implementation robust
            const text = await res.text();
            const aiMsg: IdeaInsight = {
                id: Date.now() + 1, // Ensure different ID
                is_ai_generated: true,
                message: text.trim(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                user_id: 0,
            };
            setMessages((prev) => [...prev, aiMsg]);

        } catch (error: any) {
            console.error('Chat error:', error);
            const aiMsg: IdeaInsight = {
                id: Date.now() + 1,
                is_ai_generated: true,
                message: error?.message || 'Maaf, terjadi kendala saat memproses. Coba lagi sebentar ya, atau ringkas ide kamu.',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                user_id: 0,
            };
            setMessages((prev) => [...prev, aiMsg]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="border-muted/40 bg-card">
            <CardContent className="p-0">
                <div className="grid h-[84dvh] grid-rows-[1fr_auto] md:h-[72dvh]">
                    <div className="space-y-4 overflow-y-auto p-4">
                        {messages.map((m) => (
                            <ChatMessage
                                key={m.id}
                                isAiGenerated={m.is_ai_generated}
                                message={m.message}
                            />
                        ))}
                        {isLoading ? (
                            <div className="text-sm text-muted-foreground">
                                AI sedang menulis…
                            </div>
                        ) : null}
                        <div ref={bottomRef} />
                    </div>

                    <Separator className="bg-border" />

                    <div className="space-y-3 p-4">
                        {/* Composer */}
                        <form onSubmit={handleSend} className="space-y-2">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Tulis pertanyaan atau curhat ide di sini..."
                                className="min-h-[88px]"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend(e);
                                    }
                                }}
                            />
                            <div className="flex items-center justify-between gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setExportOpen(true)}
                                    disabled={messages.length <= 1}
                                >
                                    Ekspor ke Forum/Kolaborasi
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                >
                                    {isLoading ? 'Mengirim...' : 'Kirim'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                <ExportDialog
                    open={exportOpen}
                    onOpenChange={setExportOpen}
                    transcript={messages}
                />
            </CardContent>
        </Card>
    );
}
