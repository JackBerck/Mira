import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"

export function CtaSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="rounded-lg border bg-card p-8 text-center">
        <h3 className="text-balance text-2xl font-semibold md:text-3xl">Ubah Ide Menjadi Aksi Nyata</h3>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
          Mulai dari percakapan kecil, bertransformasi menjadi inovasi nyata—bersama komunitas yang peduli.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/auth/register">Gabung Sekarang</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/#tentang">Pelajari Mira</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
