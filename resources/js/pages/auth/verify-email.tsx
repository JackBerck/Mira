import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import { logout } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { AuthShell } from '@/components/auth/auth-layout';

export default function VerifyEmailPage({ status }: { status?: string }) {
  return (
    <>
      <Head title="Verifikasi Email" />
      <AuthShell
        title="Verifikasi email Anda"
        description="Kami telah mengirimkan tautan verifikasi ke email Anda. Jika belum menerima, Anda dapat mengirim ulang."
      >
        {status === 'verification-link-sent' && (
          <div className="mb-4 text-center text-sm font-medium text-green-600">
            Tautan verifikasi baru telah dikirim ke alamat email yang Anda daftarkan.
          </div>
        )}

        <Form
          {...EmailVerificationNotificationController.store.form()}
          className="space-y-6 text-center"
        >
          {({ processing }) => (
            <>
              <Button disabled={processing} variant="secondary">
                {processing && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                Kirim ulang email verifikasi
              </Button>

              <TextLink href={logout()} className="mx-auto block text-sm">
                Keluar dan ganti akun
              </TextLink>
            </>
          )}
        </Form>
      </AuthShell>
    </>
  );
}