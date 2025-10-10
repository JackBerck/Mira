import NewPasswordController from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import { AuthShell } from '@/components/auth/auth-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPasswordPage({
    token,
    email,
}: ResetPasswordProps) {
    return (
        <>
            <Head title="Atur ulang kata sandi" />
            <AuthShell
                title="Atur ulang kata sandi"
                description="Silakan masukkan kata sandi baru Anda."
            >
                <Form
                    {...NewPasswordController.store.form()}
                    transform={(data) => ({ ...data, token, email })}
                    resetOnSuccess={['password', 'password_confirmation']}
                    className="grid gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    readOnly
                                    autoComplete="email"
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    Kata sandi baru
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    autoFocus
                                    placeholder="••••••••"
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Konfirmasi kata sandi
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                disabled={processing}
                                data-test="reset-password-button"
                            >
                                {processing && (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Perbarui kata sandi
                            </Button>

                            <p className="mt-4 text-center text-sm text-muted-foreground">
                                Kembali ke{' '}
                                <Link
                                    href="/auth/login"
                                    className="font-medium text-foreground underline-offset-4 hover:underline"
                                >
                                    halaman masuk
                                </Link>
                                .
                            </p>
                        </>
                    )}
                </Form>
            </AuthShell>
        </>
    );
}
