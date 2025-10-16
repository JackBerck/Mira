import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Check, X } from 'lucide-react';
import axios from 'axios';

interface JoinRequest {
    id: number;
    message: string | null;
    user: {
        id: number;
        name: string;
        email: string;
        avatar: string | null;
    };
    created_at: string;
}

interface PendingJoinRequestsProps {
    collaborationId: number;
    isOwner: boolean;
}

export function PendingJoinRequests({
    collaborationId,
    isOwner,
}: PendingJoinRequestsProps) {
    const [requests, setRequests] = useState<JoinRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        if (!isOwner) return;

        const fetchRequests = async () => {
            try {
                const response = await axios.get(
                    `/kolaborasi/${collaborationId}/pending-requests`,
                );
                setRequests(response.data.requests);
            } catch (error) {
                console.error('Error fetching join requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();

        // Refresh every 30 seconds
        const interval = setInterval(fetchRequests, 30000);
        return () => clearInterval(interval);
    }, [collaborationId, isOwner]);

    const handleAccept = async (requestId: number) => {
        setProcessingId(requestId);
        router.post(
            `/kolaborasi/join-request/${requestId}/accept`,
            {},
            {
                onSuccess: () => {
                    setRequests((prev) =>
                        prev.filter((req) => req.id !== requestId),
                    );
                },
                onFinish: () => setProcessingId(null),
            },
        );
    };

    const handleReject = async (requestId: number) => {
        setProcessingId(requestId);
        router.post(
            `/kolaborasi/join-request/${requestId}/reject`,
            {},
            {
                onSuccess: () => {
                    setRequests((prev) =>
                        prev.filter((req) => req.id !== requestId),
                    );
                },
                onFinish: () => setProcessingId(null),
            },
        );
    };

    if (!isOwner || loading || requests.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3 border-b p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
                <UserPlus className="h-4 w-4" />
                <span>Permintaan Bergabung ({requests.length})</span>
            </div>

            <div className="space-y-2">
                {requests.map((request) => (
                    <Card key={request.id} className="p-3">
                        <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={request.user.avatar || undefined}
                                    alt={request.user.name}
                                />
                                <AvatarFallback>
                                    {request.user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-2">
                                <div>
                                    <p className="text-sm font-medium">
                                        {request.user.name}
                                    </p>
                                    {request.message && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            "{request.message}"
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => handleAccept(request.id)}
                                        disabled={processingId === request.id}
                                    >
                                        <Check className="mr-1 h-3 w-3" />
                                        Terima
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleReject(request.id)}
                                        disabled={processingId === request.id}
                                    >
                                        <X className="mr-1 h-3 w-3" />
                                        Tolak
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
