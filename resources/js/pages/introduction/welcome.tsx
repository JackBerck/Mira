import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/guest-layout';
import { Link } from '@inertiajs/react';

export default function Home() {
    return (
        <GuestLayout>
            <section className="section-padding-x py-12 md:py-12">
                <div className="container grid max-w-screen-xl gap-8 pt-24 pb-36 md:grid-cols-2 md:py-0">
                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl font-semibold text-balance md:text-5xl">
                            Mira — Where Wonder Meets Collaboration.
                        </h1>
                        <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
                            Ketika rasa ingin tahu bertemu dengan kolaborasi.
                            Mulai jelajahi ide, berdiskusi, dan wujudkan inovasi
                            bersama dalam atmosfer yang estetik, intuitif, dan
                            inspiratif.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <Button asChild>
                                <Link href="/register">Bergabung Sekarang</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/forum">Jelajahi Forum</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="relative hidden max-w-xl md:block">
                        <img
                            src="/img/backgrounds/abstract-flower.png"
                            alt="Ilustrasi kolaborasi generasi muda berdiskusi dan membangun ide bersama"
                            className="h-auto w-full rounded-lg object-cover"
                        />
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
