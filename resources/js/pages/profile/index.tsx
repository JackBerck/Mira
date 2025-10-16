import UpdatePasswordForm from '@/components/profile/update-password-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ProfileLayout from '@/layouts/profile-layout';
import { useForm } from '@inertiajs/react';
import { Avatar } from '@radix-ui/react-avatar';
import { AlertCircle, Camera, Check, Upload } from 'lucide-react';
import { useState } from 'react';

interface ProfileData {
    name: string;
    email: string;
    bio: string;
    portfolio_url: string;
    image?: string;
}

interface ProfileProps {
    user: ProfileData;
    status?: string;
    mustVerifyEmail: boolean;
}

export default function Profile({
    user,
    status,
    mustVerifyEmail,
}: ProfileProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(
        user.image || null,
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        portfolio_url: user.portfolio_url || '',
        image: null as File | null,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/profile', {
            forceFormData: true,
            onSuccess: () => {
                // Reset form after successful update
            },
        });
    };

    return (
        <ProfileLayout title="Kelola Akun">
            <div className="space-y-6">
                {/* Status Messages */}
                {status === 'profile-updated' && (
                    <Alert className="border-green-200 bg-green-50">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Profile berhasil diperbarui!
                        </AlertDescription>
                    </Alert>
                )}

                {status === 'password-updated' && (
                    <Alert className="border-green-200 bg-green-50">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Password berhasil diubah!
                        </AlertDescription>
                    </Alert>
                )}

                {mustVerifyEmail && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                            Email Anda belum diverifikasi. Silakan cek inbox
                            untuk link verifikasi.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Profile Picture */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Foto Profil</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-2xl font-bold text-white">
                                    <Avatar>
                                        <AvatarImage
                                            src={`/storage/profile-images/${imagePreview}`}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                        <AvatarFallback className='bg-transparent'>
                                            {data.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <label className="absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 transition-colors hover:bg-blue-700">
                                    <Camera className="h-4 w-4 text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div>
                                <h3 className="mb-1 font-medium text-gray-900">
                                    Upload foto profil baru
                                </h3>
                                <p className="mb-3 text-sm text-gray-600">
                                    Format JPG, PNG. Maksimal 2MB.
                                </p>
                                <label className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Choose File
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                        {errors.image && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.image}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Basic Information */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Informasi Dasar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="w-full"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="w-full"
                                        placeholder="nama@email.com"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={data.bio}
                                    onChange={(e) =>
                                        setData('bio', e.target.value)
                                    }
                                    className="min-h-[120px] w-full resize-none"
                                    placeholder="Ceritakan tentang diri Anda, passion, dan visi kolaborasi yang diinginkan..."
                                    maxLength={500}
                                />
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>
                                        Tuliskan bio yang menarik untuk menarik
                                        kolaborator potensial
                                    </span>
                                    <span>{data.bio.length}/500</span>
                                </div>
                                {errors.bio && (
                                    <p className="text-sm text-red-600">
                                        {errors.bio}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="portfolio_url">
                                    Portfolio URL
                                </Label>
                                <Input
                                    id="portfolio_url"
                                    type="url"
                                    value={data.portfolio_url}
                                    onChange={(e) =>
                                        setData('portfolio_url', e.target.value)
                                    }
                                    className="w-full"
                                    placeholder="https://portfolio.com atau https://linkedin.com/in/username"
                                />
                                <p className="text-sm text-gray-500">
                                    Link ke portfolio, LinkedIn, GitHub, atau
                                    website personal Anda
                                </p>
                                {errors.portfolio_url && (
                                    <p className="text-sm text-red-600">
                                        {errors.portfolio_url}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => reset()}
                                    disabled={processing}
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
                                        : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Account Security */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Keamanan Akun</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    Password
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Terakhir diubah 3 bulan yang lalu
                                </p>
                            </div>
                            <UpdatePasswordForm />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ProfileLayout>
    );
}
