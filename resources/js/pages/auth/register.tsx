import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
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
import { Form, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function Register() {
    return (
        <AuthLayout
            title="Bergabung dengan Mira"
            subtitle="Bangun ide bersama komunitas. Sederhana, intuitif, dan kolaboratif."
            imageAlt="Calm minimal collaboration illustration"
        >
            <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-xl">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-center text-xl font-bold">
                        Buat akun Mira
                    </CardTitle>
                    <CardDescription className="text-center">
                        Mulai perjalanan kolaborasi kreatifmu.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8">
                    <Form
                        {...RegisteredUserController.store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                        className="grid gap-5"
                        noValidate
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-sm font-medium"
                                    >
                                        Nama
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Nama lengkap"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        className="h-11 rounded-lg"
                                    />
                                    <InputError message={errors.name} />
                                </div>

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
                                        placeholder="kamu@mail.com"
                                        required
                                        tabIndex={2}
                                        className="h-11 rounded-lg"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium"
                                    >
                                        Kata sandi
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                        tabIndex={3}
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
                                        tabIndex={4}
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
                                    tabIndex={5}
                                    data-test="register-user-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {processing ? 'Memproses...' : 'Daftar'}
                                </Button>
                            </>
                        )}
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center bg-gray-50 px-8 pt-4 pb-8">
                    <p className="text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-800"
                            tabIndex={6}
                        >
                            Masuk
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}
