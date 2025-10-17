import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { router, useForm } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface ForumFormProps {
    categories: Category[];
    initial?: {
        title?: string;
        description?: string;
        forum_category_id?: number;
        tags?: string[];
        image?: string | null;
    };
}

export function ForumForm({ categories, initial }: ForumFormProps) {
    const [tagsInput, setTagsInput] = useState<string>(initial?.tags?.join(', ') ?? '');
    const [preview, setPreview] = useState<string | null>(initial?.image ?? null);

    const { data, setData, errors } = useForm({
        title: initial?.title ?? '',
        description: initial?.description ?? '',
        forum_category_id: initial?.forum_category_id ?? categories[0]?.id ?? 0,
        tags: initial?.tags ?? [] as string[],
        image: null as File | null,
    });

    const [isProcessing, setIsProcessing] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        const tagsArray = tagsInput.split(',').map((s) => s.trim()).filter(Boolean);

        const formData = {
            ...data,
            tags: tagsArray,
        };

        router.post('/beranda/forum', formData, {
            forceFormData: true,
            onStart: () => setIsProcessing(true),
            onFinish: () => setIsProcessing(false),
            onSuccess: () => {
                // Form berhasil disubmit
            },
        });
    }

    return (
        <form onSubmit={onSubmit}>
            {initial && (
            <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                Data awal dimuat. Silakan tinjau sebelum menyimpan.
            </div>
            )}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul Topik</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Contoh: Mencari Frontend Developer untuk Proyek Sosial"
                                required
                                autoFocus
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Jelaskan secara detail ide Anda, apa yang Anda cari, dan tujuan yang ingin dicapai..."
                                required
                                className='flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Gambar Sampul (Opsional)</Label>
                            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                            <p className="text-xs text-muted-foreground">Gambar akan membuat topik Anda lebih menarik.</p>
                            {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                            {preview && (
                                <div className="mt-4">
                                    <img src={preview} alt="Preview" className="max-h-48 rounded-md border object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-1">
                        <div className="space-y-2">
                            <Label>Kategori</Label>
                            <Select
                                value={String(data.forum_category_id)}
                                onValueChange={(v) => setData('forum_category_id', Number(v))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.forum_category_id && <p className="text-sm text-red-500">{errors.forum_category_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
                            <Input
                                id="tags"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                placeholder="Contoh: PHP, Laravel, React"
                            />
                            <p className="text-xs text-muted-foreground">Tags membantu orang lain menemukan topik Anda.</p>
                            {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                    <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? 'Membuat Topik...' : 'Buat Topik'}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                            alert(
                                'Fitur Insight AI akan menilai kelayakan ide secara singkat (placeholder).',
                            )
                        }
                    >
                        Insight AI (Preview)
                    </Button>
                </div>
        </form>

    );
}
