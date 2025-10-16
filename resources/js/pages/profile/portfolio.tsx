import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ProfileLayout from '@/layouts/profile-layout';
import { useForm } from '@inertiajs/react';
import {
    Award,
    Calendar,
    Check,
    Edit,
    ExternalLink,
    Plus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface PortfolioItem {
    id: number;
    title: string;
    description: string;
    url?: string;
    image?: string;
    tags: string[];
    type: 'project' | 'achievement' | 'experience';
    date: string;
}

interface PortfolioProps {
    portfolioItems: PortfolioItem[];
    status?: string;
}

export default function Portfolio({
    portfolioItems = [],
    status,
}: PortfolioProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
    const [tagInput, setTagInput] = useState('');

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        title: '',
        description: '',
        url: '',
        image: null as File | null,
        tags: [] as string[],
        type: 'project' as 'project' | 'achievement' | 'experience',
        date: new Date().toISOString().split('T')[0],
    });

    const portfolioTypes = [
        {
            value: 'project',
            label: 'Project',
            icon: '🚀',
            color: 'bg-blue-100 text-blue-800',
        },
        {
            value: 'achievement',
            label: 'Achievement',
            icon: '🏆',
            color: 'bg-yellow-100 text-yellow-800',
        },
        {
            value: 'experience',
            label: 'Experience',
            icon: '💼',
            color: 'bg-green-100 text-green-800',
        },
    ];

    const addTag = (tag: string) => {
        if (tag && !data.tags.includes(tag)) {
            setData('tags', [...data.tags, tag]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setData(
            'tags',
            data.tags.filter((tag) => tag !== tagToRemove),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            put(`/profile/portfolio/${editingItem.id}`, {
                forceFormData: true,
                onSuccess: () => {
                    setEditingItem(null);
                    setIsAddModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/profile/portfolio', {
                forceFormData: true,
                onSuccess: () => {
                    setIsAddModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (item: PortfolioItem) => {
        setData({
            title: item.title,
            description: item.description,
            url: item.url || '',
            image: null,
            tags: item.tags,
            type: item.type,
            date: item.date,
        });
        setEditingItem(item);
        setIsAddModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus item portfolio ini?')) {
            destroy(`/profile/portfolio/${id}`);
        }
    };

    const getTypeConfig = (type: string) => {
        return (
            portfolioTypes.find((t) => t.value === type) || portfolioTypes[0]
        );
    };

    return (
        <ProfileLayout title="Portfolio">
            <div className="space-y-6">
                {/* Status Message */}
                {status === 'portfolio-updated' && (
                    <Alert className="border-green-200 bg-green-50">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Portfolio berhasil diperbarui!
                        </AlertDescription>
                    </Alert>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Portfolio Saya
                        </h2>
                        <p className="text-gray-600">
                            Showcase karya dan pencapaian Anda untuk menarik
                            kolaborator
                        </p>
                    </div>

                    <Dialog
                        open={isAddModalOpen}
                        onOpenChange={setIsAddModalOpen}
                    >
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingItem
                                        ? 'Edit Portfolio Item'
                                        : 'Tambah Portfolio Item'}
                                </DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        placeholder="Nama project/achievement/experience"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipe</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {portfolioTypes.map((type) => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        'type',
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        type.value as any,
                                                    )
                                                }
                                                className={`rounded-lg border p-3 text-center transition-colors ${
                                                    data.type === type.value
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="mb-1 text-2xl">
                                                    {type.icon}
                                                </div>
                                                <div className="text-sm font-medium">
                                                    {type.label}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Deskripsi
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Jelaskan detail tentang project/achievement ini..."
                                        className="min-h-[120px] resize-none"
                                        required
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="url">
                                            URL/Link (Opsional)
                                        </Label>
                                        <Input
                                            id="url"
                                            type="url"
                                            value={data.url}
                                            onChange={(e) =>
                                                setData('url', e.target.value)
                                            }
                                            placeholder="https://example.com"
                                        />
                                        {errors.url && (
                                            <p className="text-sm text-red-600">
                                                {errors.url}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date">Tanggal</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={data.date}
                                            onChange={(e) =>
                                                setData('date', e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Gambar (Opsional)</Label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setData(
                                                'image',
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {errors.image && (
                                        <p className="text-sm text-red-600">
                                            {errors.image}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label>Tags</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={tagInput}
                                            onChange={(e) =>
                                                setTagInput(e.target.value)
                                            }
                                            placeholder="Tambah tag..."
                                            className="flex-1"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addTag(tagInput);
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addTag(tagInput)}
                                            disabled={!tagInput.trim()}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {data.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {data.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    className="pr-1"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeTag(tag)
                                                        }
                                                        className="ml-2 rounded-full p-0.5 hover:bg-blue-700"
                                                    >
                                                        <Plus className="h-3 w-3 rotate-45" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsAddModalOpen(false);
                                            setEditingItem(null);
                                            reset();
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {processing
                                            ? 'Menyimpan...'
                                            : editingItem
                                              ? 'Update'
                                              : 'Simpan'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Portfolio Items */}
                {portfolioItems.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {portfolioItems.map((item) => {
                            const typeConfig = getTypeConfig(item.type);
                            return (
                                <Card
                                    key={item.id}
                                    className="border-0 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Badge
                                                    className={typeConfig.color}
                                                >
                                                    {typeConfig.icon}{' '}
                                                    {typeConfig.label}
                                                </Badge>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="mr-1 h-4 w-4" />
                                                    {new Date(
                                                        item.date,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {item.image && (
                                            <div className="mb-4 overflow-hidden rounded-lg">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="h-48 w-full object-cover"
                                                />
                                            </div>
                                        )}

                                        <h3 className="mb-2 font-semibold text-gray-900">
                                            {item.title}
                                        </h3>

                                        <p className="mb-4 text-sm leading-relaxed text-gray-600">
                                            {item.description}
                                        </p>

                                        {item.tags.length > 0 && (
                                            <div className="mb-4 flex flex-wrap gap-2">
                                                {item.tags.map((tag) => (
                                                    <Badge
                                                        key={tag}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        {item.url && (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                                            >
                                                <ExternalLink className="mr-1 h-4 w-4" />
                                                Lihat Project
                                            </a>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <Award className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                                Belum Ada Portfolio
                            </h3>
                            <p className="mx-auto mb-6 max-w-md text-gray-600">
                                Mulai tambahkan project, achievement, atau
                                experience untuk menarik kolaborator potensial
                            </p>
                            <Button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Item Pertama
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Tips Card */}
                <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm">
                    <CardContent className="p-6">
                        <h3 className="mb-3 font-semibold text-gray-900">
                            💡 Tips Portfolio yang Menarik
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>
                                • Sertakan gambar atau screenshot untuk
                                visualisasi yang lebih baik
                            </li>
                            <li>
                                • Tulis deskripsi yang jelas tentang peran dan
                                kontribusi Anda
                            </li>
                            <li>
                                • Tambahkan link ke project live atau repository
                                GitHub
                            </li>
                            <li>
                                • Update portfolio secara berkala dengan project
                                terbaru
                            </li>
                            <li>
                                • Gunakan tags yang relevan untuk memudahkan
                                pencarian kolaborator
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </ProfileLayout>
    );
}
