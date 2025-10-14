import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type React from 'react';
import { toast } from 'sonner';
import { Toaster } from './ui/sooner';

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

interface Props {
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function ContactForm({ flash }: Props) {
    const { data, setData, post, processing, errors, reset, wasSuccessful } =
        useForm<ContactFormData>({
            name: '',
            email: '',
            message: '',
        });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('feedback.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
            onError: () => {
                toast.error('Gagal mengirim pesan. Silakan periksa form Anda.');
            },
        });
    };

    return (
        <>
            <Toaster />
            <div className="space-y-4">
                {/* Success Alert */}
                {(wasSuccessful || flash?.success) && (
                    <Alert className="border-green-200 bg-green-50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            {flash?.success ||
                                'Pesan Anda berhasil dikirim! Terima kasih atas feedback Anda.'}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Error Alert (General) */}
                {flash?.error && (
                    <Alert className="border-red-200 bg-red-50">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            {flash.error}
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Nama lengkap"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="nama@contoh.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Message Field */}
                    <div className="grid gap-2">
                        <Label htmlFor="message">Pesan</Label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="Ceritakan kebutuhan atau pertanyaan Anda"
                            rows={5}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            className={errors.message ? 'border-red-500' : ''}
                        />
                        {errors.message && (
                            <p className="text-sm text-red-600">
                                {errors.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full sm:w-auto"
                    >
                        {processing ? 'Mengirim...' : 'Kirim Pesan'}
                    </Button>
                </form>
            </div>
        </>
    );
}
