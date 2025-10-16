import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function UpdatePasswordForm() {
    const [isOpen, setIsOpen] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('profile.password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Ubah Password
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ubah Password</DialogTitle>
                    <DialogDescription>
                        Pastikan akun Anda menggunakan password yang panjang dan
                        acak agar tetap aman.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={updatePassword} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="current_password">
                            Password Saat Ini
                        </Label>
                        <Input
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            type="password"
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                        />
                        {errors.current_password && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.current_password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password Baru</Label>
                        <Input
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            type="password"
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">
                            Konfirmasi Password Baru
                        </Label>
                        <Input
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            type="password"
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                        />
                        {errors.password_confirmation && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>
                </form>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        onClick={updatePassword}
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Password'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
