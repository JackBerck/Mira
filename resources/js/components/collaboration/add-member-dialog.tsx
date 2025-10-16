import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { router } from '@inertiajs/react';
import { UserPlus, Check } from 'lucide-react';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
}

interface AddMemberDialogProps {
    collaborationSlug: string;
}

export function AddMemberDialog({ collaborationSlug }: AddMemberDialogProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    async function searchUsers() {
        setSearching(true);
        try {
            const response = await axios.get(
                `/beranda/kolaborasi/${collaborationSlug}/search-users`,
                {
                    params: { search },
                },
            );
            setUsers(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setSearching(false);
        }
    }

    useEffect(() => {
        if (!open) {
            setSearch('');
            setUsers([]);
            setSelectedUser(null);
            setRole('');
            return;
        }

        if (search.length < 2) {
            setUsers([]);
            return;
        }

        const delaySearch = setTimeout(() => {
            searchUsers();
        }, 300);

        return () => clearTimeout(delaySearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, open]);

    function handleAddMember() {
        if (!selectedUser || !role.trim()) {
            return;
        }

        setLoading(true);
        router.post(
            `/beranda/kolaborasi/${collaborationSlug}/member`,
            {
                user_id: selectedUser.id,
                role: role.trim(),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                },
                onFinish: () => {
                    setLoading(false);
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Tambah Anggota
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tambah Anggota Baru</DialogTitle>
                    <DialogDescription>
                        Cari dan tambahkan anggota baru ke kolaborasi Anda.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* User Search */}
                    <div className="space-y-2">
                        <Label htmlFor="search-user">Cari User</Label>
                        <Input
                            id="search-user"
                            type="text"
                            placeholder="Ketik nama atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search.length > 0 && search.length < 2 && (
                            <p className="text-xs text-muted-foreground">
                                Ketik minimal 2 karakter untuk mencari
                            </p>
                        )}
                        
                        {/* Search Results */}
                        {search.length >= 2 && (
                            <div className="mt-2 rounded-lg border">
                                {searching && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        Mencari...
                                    </div>
                                )}
                                {!searching && users.length === 0 && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        User tidak ditemukan.
                                    </div>
                                )}
                                {!searching && users.length > 0 && (
                                    <div className="max-h-[240px] overflow-y-auto">
                                        {users.map((user) => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedUser(user)
                                                }
                                                className={`flex w-full items-center gap-3 border-b p-3 text-left transition-colors hover:bg-muted/50 last:border-b-0 ${
                                                    selectedUser?.id === user.id
                                                        ? 'bg-primary/10'
                                                        : ''
                                                }`}
                                            >
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={
                                                            user.avatar ||
                                                            undefined
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                {selectedUser?.id ===
                                                    user.id && (
                                                    <Check className="h-4 w-4 text-primary" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Selected User */}
                    {selectedUser && (
                        <div className="rounded-lg border bg-muted/30 p-3">
                            <p className="mb-2 text-xs font-medium text-muted-foreground">
                                User Terpilih:
                            </p>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={selectedUser.avatar || undefined}
                                    />
                                    <AvatarFallback>
                                        {getInitials(selectedUser.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">
                                        {selectedUser.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {selectedUser.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Role Input */}
                    <div className="space-y-2">
                        <Label htmlFor="role">Role / Peran</Label>
                        <Input
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Contoh: Frontend Developer, Designer, etc."
                            disabled={!selectedUser}
                        />
                        <p className="text-xs text-muted-foreground">
                            Tentukan peran user dalam kolaborasi ini
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleAddMember}
                        disabled={!selectedUser || !role.trim() || loading}
                    >
                        {loading ? 'Menambahkan...' : 'Tambah Anggota'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
