import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Forum Dinamis & Tematik",
    desc: "Diskusi terbagi dalam kategori seperti Teknologi, Sosial, Kreatif, dan Lingkungan yang dapat berkembang menjadi project rooms.",
  },
  {
    title: "AI Idea Companion",
    desc: "Asisten AI memberi umpan balik cepat: kelayakan, saran pengembangan, dan referensi topik serupa untuk memperkaya ide.",
  },
  {
    title: "Kolaborasi Adaptif",
    desc: "Matchmaking otomatis mencocokkan pengguna berdasarkan minat dan keahlian untuk membentuk tim yang tepat.",
  },
  {
    title: "Journey-Based Collaboration",
    desc: "Tidak berhenti di obrolan. Mira menuntun ide dari konsep hingga realisasi lewat proses yang sederhana dan bermakna.",
  },
]

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-2xl font-semibold md:text-3xl">Mengapa Mira?</h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          Platform kolaboratif yang menenangkan, fokus pada konten dan koneksi—bukan distraksi.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Card key={f.title} className="h-full">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
