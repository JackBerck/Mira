import Layout from '@/layouts';
import { cn } from '@/lib/utils';

type AuthShellProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
    imageAlt?: string;
    imageUrl?: string;
    className?: string;
};

export function AuthShell({
    title,
    description,
    children,
    imageAlt = 'Ilustrasi kolaborasi yang tenang',
    imageUrl = '/img/backgrounds/calm-minimal-collaboration-illustration.jpg',
    className,
}: AuthShellProps) {
    return (
        <Layout>
            <div
                className={cn(
                    'section-padding container grid w-full max-w-screen-xl gap-8 md:grid-cols-2 md:gap-10',
                    className,
                )}
            >
                <section className="order-2 mx-auto flex w-full flex-col justify-center md:order-1">
                    <header className="mb-6 space-y-2 text-center md:text-left">
                        <h1 className="text-2xl leading-tight font-semibold text-balance md:text-3xl">
                            {title}
                        </h1>
                        {description ? (
                            <p className="text-sm text-pretty text-muted-foreground md:text-base">
                                {description}
                            </p>
                        ) : null}
                    </header>
                    <div className="rounded-lg border bg-card shadow-sm md:p-6">
                        {children}
                    </div>
                </section>

                <aside className="order-1 md:order-2">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-muted">
                        <img
                            src={imageUrl || '/img/placeholder.png'}
                            alt={imageAlt}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>
                </aside>
            </div>
        </Layout>
    );
}
