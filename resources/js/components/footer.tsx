import { Link } from "@inertiajs/react"

export function Footer() {
  return (
    <footer className="border-t bg-background section-padding-x ">
      <div className="container grid gap-8 py-10 md:grid-cols-4 max-w-screen-xl">
        <div className="col-span-1 md:col-span-2">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="rounded-md border px-2 py-1 text-sm font-medium tracking-wide">Mira</span>
            <span className="sr-only">Mira — Where Wonder Meets Collaboration</span>
          </div>
          <p className="max-w-prose text-pretty text-sm text-muted-foreground">
            {"“Mira — Where Wonder Meets Collaboration.”"} Ruang kolaboratif yang menuntun ide kecil bertumbuh menjadi
            aksi nyata dalam atmosfer estetik, intuitif, dan inspiratif.
          </p>
        </div>

        <nav aria-label="Tautan cepat" className="grid grid-cols-2 gap-6 md:col-span-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold">Produk</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/forum" className="text-muted-foreground hover:text-foreground">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/kolaborasi" className="text-muted-foreground hover:text-foreground">
                  Yuk Kolaborasi
                </Link>
              </li>
              <li>
                <Link href="/mari-berpikir" className="text-muted-foreground hover:text-foreground">
                  Mari Berpikir (AI)
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Perusahaan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#tentang" className="text-muted-foreground hover:text-foreground">
                  Tentang
                </Link>
              </li>
              <li>
                <Link href="/hubungi-kami" className="text-muted-foreground hover:text-foreground">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-muted-foreground hover:text-foreground">
                  Gabung Sekarang
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Mira. Semua hak cipta dilindungi.</p>
          <p className="text-center md:text-right">{"“Mira — Where Wonder Meets Collaboration.”"}</p>
        </div>
      </div>
    </footer>
  )
}
