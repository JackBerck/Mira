import NewPasswordController from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
import AuthLayout from '@/components/auth/auth-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <AuthLayout
            title="Atur ulang kata sandi"
            subtitle="Buat kata sandi baru untuk keamanan akun Anda."
            imageAlt="Calm minimal collaboration illustration"
        >
            <Head title="Atur ulang kata sandi" />

            <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-xl">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-center text-xl font-bold">
                        Atur ulang kata sandi
                    </CardTitle>
                    <CardDescription className="text-center">
                        Buat kata sandi baru untuk akun Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8">
                    <Form
                        {...NewPasswordController.store.form()}
                        transform={(data) => ({ ...data, token, email })}
                        resetOnSuccess={['password', 'password_confirmation']}
                    >
                        {({ processing, errors }) => (
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        value={email}
                                        className="h-11 rounded-lg bg-gray-50"
                                        readOnly
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium"
                                    >
                                        Kata sandi baru
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                        autoFocus
                                        className="h-11 rounded-lg"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="text-sm font-medium"
                                    >
                                        Konfirmasi kata sandi
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                        className="h-11 rounded-lg"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 h-11 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-medium shadow-md hover:from-indigo-700 hover:to-purple-700"
                                    disabled={processing}
                                    data-test="reset-password-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {processing
                                        ? 'Memperbarui...'
                                        : 'Perbarui kata sandi'}
                                </Button>
                            </div>
                        )}
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center bg-gray-50 px-8 pt-4 pb-8">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                        Kembali ke masuk
                    </Link>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}
