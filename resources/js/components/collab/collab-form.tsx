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
import { useForm } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface CollabFormProps {
    categories: Category[];
    initial?: {
        title?: string;
        description?: string;
        category_id?: number;
        status?: 'open' | 'in_progress' | 'completed';
        skills?: string;
    };
}

export function CollabForm({ categories, initial }: CollabFormProps) {
    const [skills, setSkills] = useState<string>(initial?.skills ?? '');
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        title: initial?.title ?? '',
        description: initial?.description ?? '',
        category_id: initial?.category_id ?? categories[0]?.id ?? 1,
        status: initial?.status ?? 'open',
        skills_needed: [] as string[],
        image: null as File | null,
    });

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

        const skillsArray = skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        // Set skills_needed terlebih dahulu
        setData('skills_needed', skillsArray);

        // Delay sedikit untuk memastikan state terupdate
        setTimeout(() => {
            post('/beranda/kolaborasi', {
                onSuccess: () => {
                    // Form berhasil disubmit
                },
            });
        }, 10);
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {initial && (
                <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                    Data awal dimuat. Silakan tinjau sebelum menyimpan.
                </div>
            )}

            <div className="space-y-1">
                <Label htmlFor="title">Judul Kolaborasi</Label>
                <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Contoh: Bangun Aplikasi Edukasi AI"
                    required
                />
                {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label htmlFor="description">Deskripsi</Label>
                <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Gambarkan tujuan, dampak, dan rencana kolaborasi..."
                    required
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                    <Label>Kategori</Label>
                    <Select
                        value={String(data.category_id)}
                        onValueChange={(v) => setData('category_id', Number(v))}
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
                    {errors.category_id && (
                        <p className="text-sm text-red-500">
                            {errors.category_id}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Status</Label>
                    <Select
                        value={data.status}
                        onValueChange={(
                            v: 'open' | 'in_progress' | 'completed',
                        ) => setData('status', v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="open">Terbuka</SelectItem>
                            <SelectItem value="in_progress">
                                Sedang Berjalan
                            </SelectItem>
                            <SelectItem value="completed">Selesai</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.status && (
                        <p className="text-sm text-red-500">{errors.status}</p>
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <Label htmlFor="skills">
                    Keahlian Dibutuhkan (pisahkan dengan koma)
                </Label>
                <Input
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Contoh: React, UI/UX, Riset"
                />
                <p className="text-xs text-muted-foreground">
                    Pisahkan setiap keahlian dengan koma
                </p>
                {errors.skills_needed && (
                    <p className="text-sm text-red-500">
                        {errors.skills_needed}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Gambar Thumbnail (opsional)</Label>
                <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                    Upload gambar untuk thumbnail kolaborasi. Format: JPG, PNG,
                    atau GIF. Maksimal 2MB.
                </p>
                {errors.image && (
                    <p className="text-sm text-red-500">{errors.image}</p>
                )}

                {preview && (
                    <div className="mt-2">
                        <p className="mb-2 text-sm font-medium">Preview:</p>
                        <img
                            src={preview}
                            alt="Preview thumbnail"
                            className="h-40 max-w-sm rounded-md border object-cover"
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Buat Kolaborasi'}
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
