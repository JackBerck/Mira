import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

interface AdminReportProps {
    reportableType: string;
    reportableId: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminReport({
    reportableType,
    reportableId,
    isOpen,
    onClose,
}: AdminReportProps) {
    const { data, setData, errors, post, reset, processing } = useForm({
        reportable_type: reportableType,
        reportable_id: reportableId,
        reason: '',
        message: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('admin.report'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Laporan berhasil dikirim ke admin!');
                reset('reason', 'message');
                onClose();
            },
            onError: () => {
                toast.error('Gagal mengirim laporan. Silakan coba lagi.');
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Laporkan ke Admin</DialogTitle>
                    <DialogDescription>
                        Bantu kami menjaga komunitas tetap aman dengan
                        melaporkan konten yang melanggar. Laporan Anda akan
                        ditinjau oleh tim moderasi.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Reason Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="reason">
                            Alasan Laporan{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={data.reason}
                            onValueChange={(value) => setData('reason', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih alasan pelaporan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="spam">Spam</SelectItem>
                                <SelectItem value="inappropriate">
                                    Konten Tidak Pantas
                                </SelectItem>
                                <SelectItem value="harassment">
                                    Pelecehan
                                </SelectItem>
                                <SelectItem value="misinformation">
                                    Informasi Salah
                                </SelectItem>
                                <SelectItem value="copyright">
                                    Pelanggaran Hak Cipta
                                </SelectItem>
                                <SelectItem value="other">Lainnya</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.reason && (
                            <p className="text-sm text-red-600">
                                {errors.reason}
                            </p>
                        )}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <Label htmlFor="message">
                            Deskripsi Detail{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="message"
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="Jelaskan secara detail mengapa Anda melaporkan konten ini..."
                            rows={5}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            Berikan informasi sebanyak mungkin untuk membantu
                            kami meninjau laporan Anda.
                        </p>
                        {errors.message && (
                            <p className="text-sm text-red-600">
                                {errors.message}
                            </p>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                        <p className="mb-1 font-medium">ℹ️ Catatan:</p>
                        <ul className="list-inside list-disc space-y-1 text-xs">
                            <li>Laporan bersifat anonim dan rahasia</li>
                            <li>Tim akan meninjau dalam 1-2 hari kerja</li>
                            <li>
                                Laporan palsu dapat berakibat penangguhan akun
                            </li>
                        </ul>
                    </div>
                </form>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={processing}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={processing || !data.reason || !data.message}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {processing ? 'Mengirim...' : 'Kirim Laporan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
