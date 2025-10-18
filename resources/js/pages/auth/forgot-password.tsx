import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthShell } from '@/components/auth/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
  return (
    <>
      <Head title="Lupa Kata Sandi" />
      <AuthShell
        title="Lupa kata sandi?"
        description="Masukkan email terdaftar, kami akan mengirim tautan untuk mengatur ulang kata sandi."
      >
        {status && (
          <div className="mb-4 text-center text-sm font-medium text-green-600">
            {status}
          </div>
        )}

        <Form {...PasswordResetLinkController.store.form()} className="grid gap-4">
          {({ processing, errors }) => (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  autoFocus
                  placeholder="email@example.com"
                  required
                />
                <InputError message={errors.email} />
              </div>

              <Button
                type="submit"
                disabled={processing}
                className="w-full"
                data-test="email-password-reset-link-button"
              >
                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Kirim tautan reset
              </Button>
            </>
          )}
        </Form>

        <div className="space-x-1 text-center text-sm text-muted-foreground mt-4">
          <span>Kembali ke</span>
          <TextLink href={login()}>halaman masuk</TextLink>
        </div>
      </AuthShell>
    </>
  );
}
