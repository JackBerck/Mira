import { AuthShell } from '@/components/auth/auth-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store } from '@/routes/password/confirm';
import { Form, Head, Link } from '@inertiajs/react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useState } from 'react';

export default function ConfirmPassword() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Konfirmasi Kata Sandi" />
            <AuthShell
                title="Konfirmasi kata sandi"
                description="Demi keamanan, masukkan kembali kata sandi Anda untuk melanjutkan."
            >
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="grid gap-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Kata sandi</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        required
                                        autoComplete="current-password"
                                        autoFocus
                                        className="pr-10"
                                    />
                                    <InputError message={errors.password} />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-md bg-muted/50 p-3">
                                <p className="text-xs text-muted-foreground">
                                    <Shield className="mr-1 inline h-3 w-3" />
                                    Kami memerlukan konfirmasi ini untuk
                                    melindungi akun Anda dari akses yang tidak
                                    sah.
                                </p>
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Memproses...' : 'Konfirmasi'}
                            </Button>

                            <p className="text-center text-sm text-muted-foreground">
                                Bukan Anda?{' '}
                                <Link
                                    href="/auth/login"
                                    className="font-medium text-foreground underline-offset-4 hover:underline"
                                >
                                    Keluar dan ganti akun
                                </Link>
                            </p>
                        </>
                    )}
                </Form>
            </AuthShell>
        </>
    );
}
