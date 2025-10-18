import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthShell } from '@/components/auth/auth-layout';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { register } from '@/routes';
import { request } from '@/routes/password';

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  return (
    <>
      <Head title="Masuk" />
      <AuthShell
        title="Selamat datang kembali"
        description="Masuk untuk melanjutkan eksplorasi dan kolaborasi di Mira."
      >
        <Form
          {...AuthenticatedSessionController.store.form()}
          resetOnSuccess={['password']}
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
                  required
                  autoFocus
                  autoComplete="email"
                  placeholder="kamu@email.com"
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Kata sandi</Label>
                  {canResetPassword && (
                    <TextLink
                      href={request()}
                      className="text-sm"
                      tabIndex={5}
                    >
                      Lupa kata sandi?
                    </TextLink>
                  )}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <InputError message={errors.password} />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox id="remember" name="remember" />
                <Label htmlFor="remember">Ingat saya</Label>
              </div>

              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={processing}
                data-test="login-button"
              >
                {processing && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                Masuk
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Belum punya akun?{' '}
                <TextLink href={register()} tabIndex={6}>
                  Daftar
                </TextLink>
              </div>
            </>
          )}
        </Form>

        {status && (
          <div className="mt-4 text-center text-sm font-medium text-green-600">
            {status}
          </div>
        )}
      </AuthShell>
    </>
  );
}
