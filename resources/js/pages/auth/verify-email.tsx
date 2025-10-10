import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import AuthLayout from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { logout } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function Page() {
    return (
        <AuthLayout
            title="Verifikasi email Anda"
            subtitle="Aktifkan akun agar dapat memulai kolaborasi."
            imageAlt="Calm minimal collaboration illustration"
        >
            <Head title="Verifikasi email" />

            <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-xl">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-center text-xl font-bold">
                        Verifikasi email Anda
                    </CardTitle>
                    <CardDescription className="text-center">
                        Kami telah mengirim tautan verifikasi. Periksa email dan
                        klik tautannya.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8">
                    {status === 'verification-link-sent' && (
                        <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-600">
                            Tautan verifikasi baru telah dikirim ke alamat email
                            yang Anda berikan saat pendaftaran.
                        </div>
                    )}

                    <div className="space-y-5">
                        <p className="text-center text-sm text-gray-600">
                            Tidak menerima email? Kirim ulang verifikasi.
                        </p>

                        <Form
                            {...EmailVerificationNotificationController.store.form()}
                            className="flex justify-center"
                        >
                            {({ processing }) => (
                                <Button
                                    onClick={() => {}}
                                    disabled={processing}
                                    className="h-11 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-medium shadow-md hover:from-indigo-700 hover:to-purple-700"
                                >
                                    {processing && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {processing ? 'Mengirim...' : 'Kirim ulang'}
                                </Button>
                            )}
                        </Form>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center bg-gray-50 px-8 pt-4 pb-8">
                    <Link
                        href={logout()}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                        Keluar
                    </Link>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}
