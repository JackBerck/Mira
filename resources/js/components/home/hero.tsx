import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export function HeroSection() {
    return (
        <section className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
            <div className="flex flex-col justify-center">
                <h1 className="text-3xl font-semibold text-balance md:text-5xl">
                    {'Mira — Where Wonder Meets Collaboration.'}
                </h1>
                <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
                    Ketika rasa ingin tahu bertemu dengan kolaborasi. Mulai
                    jelajahi ide, berdiskusi, dan wujudkan inovasi bersama dalam
                    atmosfer yang estetik, intuitif, dan inspiratif.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button asChild>
                        <Link href="/auth/register">Bergabung Sekarang</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/forum">Jelajahi Forum</Link>
                    </Button>
                </div>
            </div>

            <div className="relative">
                <img
                    src={
                        '/img/placeholder.png?height=480&width=720&query=kolaborasi%20anak%20muda%20berdiskusi'
                    }
                    alt="Ilustrasi kolaborasi generasi muda berdiskusi dan membangun ide bersama"
                    className="h-auto w-full rounded-lg border object-cover"
                />
            </div>
        </section>
    );
}
