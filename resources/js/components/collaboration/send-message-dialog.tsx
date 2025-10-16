'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface SendMessageDialogProps {
    receiverId: number;
    receiverName: string;
    triggerButton?: React.ReactNode;
}

export function SendMessageDialog({
    receiverId,
    receiverName,
    triggerButton,
}: SendMessageDialogProps) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        setLoading(true);

        try {
            // Send message via API
            const response = await fetch('/direct-messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    receiver_id: receiverId,
                    message: message,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Gagal mengirim pesan. Silakan coba lagi.');
                return;
            }

            // Redirect to chat page with query parameters
            router.visit(`/pesan?tab=personal&user=${receiverId}`, {
                onSuccess: () => {
                    setOpen(false);
                    setMessage('');
                },
            });
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Gagal mengirim pesan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton || (
                    <Button variant="secondary" className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Kirim Pesan
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Kirim Pesan ke {receiverName}</DialogTitle>
                    <DialogDescription>
                        Tulis pesan Anda untuk memulai percakapan dengan{' '}
                        {receiverName}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Textarea
                        placeholder="Tulis pesan Anda di sini..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[150px]"
                        disabled={loading}
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || loading}
                    >
                        {loading ? 'Mengirim...' : 'Kirim Pesan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
