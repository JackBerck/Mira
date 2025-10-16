import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export function ProfileForm({
    initial,
    onSave,
    saving,
}: {
    initial: { name: string; email: string; bio: string; avatarUrl?: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSave: (values: any) => Promise<void>;
    saving?: boolean;
}) {
    const [name, setName] = useState(initial.name);
    const [bio, setBio] = useState(initial.bio);
    const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl || '');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setAvatarUrl(url);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password && password !== passwordConfirm) {
            alert('Konfirmasi sandi tidak cocok.');
            return;
        }
        await onSave({
            name,
            bio,
            avatarUrl,
            ...(password ? { password } : {}),
        });
    };

    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
            <div className="flex items-start gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-full bg-muted">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl || '/img/placeholder.png'}
                            alt="Avatar preview"
                            className="h-20 w-20 object-cover"
                        />
                    ) : (
                        <span className="sr-only">Avatar</span>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="avatar">Foto Profil</Label>
                    <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={onAvatarChange}
                    />
                    <p className="text-xs text-muted-foreground">
                        Gunakan gambar persegi agar hasil optimal.
                    </p>
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Anda"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    value={initial.email}
                    readOnly
                    aria-readonly
                />
                <p className="text-xs text-muted-foreground">
                    Email tidak dapat diubah.
                </p>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Ceritakan diri Anda secara singkat"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="password">Kata Sandi Baru</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Opsional"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="passwordConfirm">Konfirmasi Sandi</Label>
                <Input
                    id="passwordConfirm"
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Opsional"
                />
            </div>

            <div className="md:col-span-2">
                <Button
                    type="submit"
                    disabled={saving}
                    aria-label="Simpan perubahan"
                >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
            </div>
        </form>
    );
}
