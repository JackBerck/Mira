import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function ConfirmPassword() {
    return (
        <AuthLayout
            title="Konfirmasi kata sandi"
            description="Masukkan kata sandi untuk melanjutkan tindakan sensitif."
        >
            <Head title="Konfirmasi kata sandi" />

            <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-xl">
                <CardContent className="px-8 pt-8">
                    <Form {...store.form()} resetOnSuccess={['password']}>
                        {({ processing, errors }) => (
                            <div className="space-y-5">
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
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        required
                                        autoFocus
                                        className="h-11 rounded-lg"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 h-11 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-medium shadow-md hover:from-indigo-700 hover:to-purple-700"
                                    disabled={processing}
                                    data-test="confirm-password-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {processing ? 'Memeriksa...' : 'Konfirmasi'}
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
