import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout
            title="Masuk ke Mira"
            subtitle="Mira — Where Wonder Meets Collaboration. Ruang kolaborasi yang tenang, estetik, dan bermakna."
            imageAlt="Calm minimal collaboration illustration"
        >
            <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-xl">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-center text-xl font-bold">
                        Masuk ke Mira
                    </CardTitle>
                    <CardDescription className="text-center">
                        Selamat datang kembali 👋 Mari lanjut berkolaborasi.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8">
                    {status && (
                        <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <Form
                        {...AuthenticatedSessionController.store.form()}
                        resetOnSuccess={['password']}
                        className="grid gap-5"
                        noValidate
                    >
                        {({ processing, errors }) => (
                            <div className="grid gap-4">
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
                                        autoFocus
                                        tabIndex={1}
                                        className="h-11 rounded-lg"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm font-medium"
                                        >
                                            Kata sandi
                                        </Label>
                                        {canResetPassword && (
                                            <Link
                                                href="/forgot-password"
                                                className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                                tabIndex={5}
                                            >
                                                Lupa kata sandi?
                                            </Link>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        required
                                        tabIndex={2}
                                        className="h-11 rounded-lg"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-3 py-1">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600"
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm font-normal"
                                    >
                                        Ingat saya
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 h-11 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-medium shadow-md hover:from-indigo-700 hover:to-purple-700"
                                    disabled={processing}
                                    tabIndex={4}
                                    data-test="login-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {processing ? 'Memproses...' : 'Masuk'}
                                </Button>
                            </div>
                        )}
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center bg-gray-50 px-8 pt-4 pb-8">
                    <p className="text-sm text-gray-600">
                        Baru di Mira?{' '}
                        <Link
                            href="/register"
                            className="font-medium text-indigo-600 hover:text-indigo-800"
                            tabIndex={5}
                        >
                            Daftar
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}
