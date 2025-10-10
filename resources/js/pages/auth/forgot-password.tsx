import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
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

export default function ForgotPassword() {
    return (
        <AuthLayout
            title="Lupa kata sandi"
            subtitle="Kami akan mengirim tautan reset ke email Anda."
            imageAlt="Calm minimal collaboration illustration"
        >
            <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-xl">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-center text-xl font-bold">
                        Lupa kata sandi
                    </CardTitle>
                    <CardDescription className="text-center">
                        Kami akan mengirim tautan reset ke email Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8">
                    {status && (
                        <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <Form {...PasswordResetLinkController.store.form()}>
                        {({ processing, errors }) => (
                            <div className="space-y-5">
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
                                        autoComplete="off"
                                        placeholder="kamu@mail.com"
                                        required
                                        autoFocus
                                        className="h-11 rounded-lg"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 h-11 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-medium shadow-md hover:from-indigo-700 hover:to-purple-700"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {processing
                                        ? 'Mengirim...'
                                        : 'Kirim tautan reset'}
                                </Button>
                            </div>
                        )}
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center bg-gray-50 px-8 pt-4 pb-8">
                    <div className="text-sm text-gray-600">
                        <span>Kembali ke </span>
                        <Link
                            href="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-800"
                        >
                            masuk
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}
