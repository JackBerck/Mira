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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AddMemberDialog } from '@/components/collaboration/add-member-dialog';
import AppLayout from '@/layouts/app-layout';
import { router, useForm, usePage } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Trash2, Users } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
}

interface Collaborator {
    id: number;
    role: string;
    user: User;
    joined_at: string;
}

interface Collaboration {
    id: number;
    title: string;
    slug: string;
    description: string;
    skills_needed: string[];
    status: 'open' | 'in_progress' | 'completed';
    image: string | null;
    forum_category_id: number;
    category: Category;
    user: User;
    collaborators: Collaborator[];
    collaborators_count: number;
    created_at: string;
    updated_at: string;
}

interface PageProps extends Record<string, unknown> {
    collaboration: Collaboration;
    categories: Category[];
}

export default function EditCollaborationPage() {
    const { collaboration, categories } = usePage<PageProps>().props;
    const [skills, setSkills] = useState<string>(
        collaboration.skills_needed.join(', '),
    );
    const [preview, setPreview] = useState<string | null>(
        collaboration.image,
    );

    const { data, setData, post, processing, errors } = useForm({
        title: collaboration.title,
        description: collaboration.description,
        category_id: collaboration.forum_category_id,
        status: collaboration.status,
        skills_needed: [] as string[],
        image: null as File | null,
        _method: 'PUT',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);

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

        setData('skills_needed', skillsArray);

        setTimeout(() => {
            post(`/beranda/kolaborasi/${collaboration.slug}`, {
                onSuccess: () => {
                    // Updated successfully
                },
            });
        }, 10);
    }

    function handleRemoveMember(collaboratorId: number) {
        router.delete(
            `/beranda/kolaborasi/${collaboration.slug}/member/${collaboratorId}`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Member removed successfully
                },
            },
        );
    }

    function getInitials(name: string): string {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }



    return (
        <AppLayout>
            <main className="container mx-auto space-y-6 px-4 py-8">
                <header className="space-y-1">
                    <h1 className="text-2xl font-semibold">
                        Edit Kolaborasi
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Perbarui detail kolaborasi dan kelola anggota tim Anda.
                    </p>
                </header>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Form Section */}
                    <section className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Kolaborasi</CardTitle>
                                <CardDescription>
                                    Update informasi kolaborasi Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={onSubmit} className="space-y-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="title">
                                            Judul Kolaborasi
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData('title', e.target.value)
                                            }
                                            placeholder="Contoh: Bangun Aplikasi Edukasi AI"
                                            required
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-500">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="description">
                                            Deskripsi
                                        </Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Gambarkan tujuan, dampak, dan rencana kolaborasi..."
                                            required
                                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                        <div className="space-y-1">
                                            <Label>Kategori</Label>
                                            <Select
                                                value={String(data.category_id)}
                                                onValueChange={(v) =>
                                                    setData(
                                                        'category_id',
                                                        Number(v),
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem
                                                            key={cat.id}
                                                            value={String(
                                                                cat.id,
                                                            )}
                                                        >
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
                                                    v:
                                                        | 'open'
                                                        | 'in_progress'
                                                        | 'completed',
                                                ) => setData('status', v)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="open">
                                                        Terbuka
                                                    </SelectItem>
                                                    <SelectItem value="in_progress">
                                                        Sedang Berjalan
                                                    </SelectItem>
                                                    <SelectItem value="completed">
                                                        Selesai
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.status && (
                                                <p className="text-sm text-red-500">
                                                    {errors.status}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="skills">
                                            Keahlian Dibutuhkan (pisahkan dengan
                                            koma)
                                        </Label>
                                        <Input
                                            id="skills"
                                            value={skills}
                                            onChange={(e) =>
                                                setSkills(e.target.value)
                                            }
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
                                        <Label htmlFor="image">
                                            Gambar Thumbnail
                                        </Label>
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="cursor-pointer"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Upload gambar baru untuk mengganti
                                            thumbnail. Format: JPG, PNG, atau
                                            GIF. Maksimal 2MB.
                                        </p>
                                        {errors.image && (
                                            <p className="text-sm text-red-500">
                                                {errors.image}
                                            </p>
                                        )}

                                        {preview && (
                                            <div className="mt-2">
                                                <p className="mb-2 text-sm font-medium">
                                                    {collaboration.image
                                                        ? 'Gambar Saat Ini:'
                                                        : 'Preview:'}
                                                </p>
                                                <img
                                                    src={preview}
                                                    alt="Thumbnail kolaborasi"
                                                    className="h-40 max-w-sm rounded-md border object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 pt-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Simpan Perubahan'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                router.visit(
                                                    `/beranda/kolaborasi/${collaboration.slug}`,
                                                )
                                            }
                                        >
                                            Batal
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Member Management Section */}
                    <section className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    <CardTitle>Anggota Tim</CardTitle>
                                </div>
                                <CardDescription>
                                    {collaboration.collaborators_count} anggota
                                    bergabung
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-3">
                                    <AddMemberDialog
                                        collaborationSlug={collaboration.slug}
                                    />
                                </div>
                                <div className="space-y-3">
                                    {/* Owner */}
                                    <div className="flex items-start gap-3 rounded-lg border p-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage
                                                src={
                                                    collaboration.user.avatar ||
                                                    undefined
                                                }
                                            />
                                            <AvatarFallback>
                                                {getInitials(
                                                    collaboration.user.name,
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium">
                                                    {collaboration.user.name}
                                                </p>
                                                <Badge className="bg-purple-100 text-purple-800">
                                                    Owner
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {collaboration.user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Collaborators */}
                                    {collaboration.collaborators.length ===
                                    0 ? (
                                        <div className="rounded-lg border border-dashed p-6 text-center">
                                            <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                Belum ada anggota yang bergabung
                                            </p>
                                        </div>
                                    ) : (
                                        collaboration.collaborators.map(
                                            (collaborator) => (
                                                <div
                                                    key={collaborator.id}
                                                    className="flex items-start gap-3 rounded-lg border p-3"
                                                >
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage
                                                            src={
                                                                collaborator
                                                                    .user
                                                                    .avatar ||
                                                                undefined
                                                            }
                                                        />
                                                        <AvatarFallback>
                                                            {getInitials(
                                                                collaborator
                                                                    .user.name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-medium">
                                                                {
                                                                    collaborator
                                                                        .user
                                                                        .name
                                                                }
                                                            </p>
                                                            <div className="flex items-center gap-1">
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    {
                                                                        collaborator.role
                                                                    }
                                                                </Badge>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                                                                        >
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>
                                                                                Hapus
                                                                                Anggota?
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Apakah
                                                                                Anda
                                                                                yakin
                                                                                ingin
                                                                                menghapus{' '}
                                                                                <strong>
                                                                                    {
                                                                                        collaborator
                                                                                            .user
                                                                                            .name
                                                                                    }
                                                                                </strong>{' '}
                                                                                dari
                                                                                kolaborasi
                                                                                ini?
                                                                                Tindakan
                                                                                ini
                                                                                tidak
                                                                                dapat
                                                                                dibatalkan.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>
                                                                                Batal
                                                                            </AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                className="bg-red-500 hover:bg-red-600"
                                                                                onClick={() =>
                                                                                    handleRemoveMember(
                                                                                        collaborator.id,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Hapus
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                collaborator
                                                                    .user.email
                                                            }
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Bergabung{' '}
                                                            {formatDistanceToNow(
                                                                new Date(
                                                                    collaborator.joined_at,
                                                                ),
                                                                {
                                                                    addSuffix:
                                                                        true,
                                                                    locale: localeId,
                                                                },
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </main>
        </AppLayout>
    );
}
