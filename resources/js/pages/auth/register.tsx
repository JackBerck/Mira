import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthShell } from '@/components/auth/auth-layout';

export default function RegisterPage() {
  return (
    <>
      <Head title="Daftar" />
      <AuthShell
        title="Bergabung dengan Mira"
        description="Buat akun untuk mulai berbagi ide dan berkolaborasi."
      >
        <Form
          {...RegisteredUserController.store.form()}
          resetOnSuccess={['password', 'password_confirmation']}
          disableWhileProcessing
          className="grid gap-6"
        >
          {({ processing, errors }) => (
            <>
              <div className="grid gap-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoFocus
                  autoComplete="name"
                  placeholder="Nama lengkap"
                  tabIndex={1}
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="kamu@email.com"
                  tabIndex={2}
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Kata sandi</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  tabIndex={3}
                />
                <InputError message={errors.password} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Konfirmasi kata sandi</Label>
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  tabIndex={4}
                />
                <InputError message={errors.password_confirmation} />
              </div>

              <Button
                type="submit"
                className="mt-2 w-full"
                disabled={processing}
                data-test="register-user-button"
                tabIndex={5}
              >
                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Daftar
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Sudah punya akun?{' '}
                <TextLink href={login()} tabIndex={6}>
                  Masuk
                </TextLink>
              </div>
            </>
          )}
        </Form>
      </AuthShell>
    </>
  );
}