import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface JoinCollaborationDialogProps {
    collaborationId: number;
    collaborationTitle: string;
}

export function JoinCollaborationDialog({
    collaborationId,
    collaborationTitle,
}: JoinCollaborationDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing } = useForm({
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/kolaborasi/${collaborationId}/join`, {
            onSuccess: () => {
                setOpen(false);
                setData('message', '');
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="w-full">Gabung Tim</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Gabung ke Kolaborasi
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda akan mengirim permintaan untuk bergabung ke
                            kolaborasi <strong>{collaborationTitle}</strong>.
                            Pembuat kolaborasi akan meninjau permintaan Anda.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="my-4 space-y-2">
                        <Label htmlFor="message">
                            Pesan (Opsional)
                        </Label>
                        <Textarea
                            id="message"
                            placeholder="Tulis pesan Anda untuk pembuat kolaborasi..."
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            rows={4}
                            maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground">
                            {data.message.length}/500 karakter
                        </p>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                'Kirim Permintaan'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
