import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"

const categories = [
  {
    key: "teknologi",
    title: "Teknologi",
    desc: "Inovasi perangkat lunak, AI, dan sistem cerdas.",
    imgQuery: "ilustrasi%20teknologi%20modern",
  },
  {
    key: "sosial",
    title: "Sosial",
    desc: "Gagasan untuk dampak komunitas dan isu kemanusiaan.",
    imgQuery: "ilustrasi%20dampak%20sosial",
  },
  {
    key: "kreatif",
    title: "Kreatif",
    desc: "Desain, seni, media, dan ekspresi kreatif lain.",
    imgQuery: "ilustrasi%20kreativitas",
  },
  {
    key: "lingkungan",
    title: "Lingkungan",
    desc: "Solusi untuk keberlanjutan dan ekologi.",
    imgQuery: "ilustrasi%20lingkungan%20hijau",
  },
]

export function CategoriesSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-2xl font-semibold md:text-3xl">Kategori Tematik</h2>
        <p className="mt-3 text-pretty text-muted-foreground">Temukan ruang diskusi yang sesuai dengan minatmu.</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Card key={cat.key} className="h-full">
            <CardHeader className="space-y-3">
              <div className="relative h-36 w-full overflow-hidden rounded-md border">
                <img
                  src={`/.jpg?height=144&width=640&query=${cat.imgQuery}`}
                  alt={`Gambar kategori ${cat.title}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardTitle className="text-lg">{cat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{cat.desc}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" className="px-0">
                <Link href={`/forum?kategori=${cat.key}`}>Lihat Diskusi</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
