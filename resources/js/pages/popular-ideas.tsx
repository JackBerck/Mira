import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const ideas = [
  { title: "Peta Akses UMKM Berbasis AI", tags: ["Sosial", "AI"], score: "Kolaboratif" },
  { title: "Asisten Belajar Terbuka", tags: ["Teknologi", "Edukasi"], score: "Trending" },
  { title: "Bank Visual Seni Nusantara", tags: ["Kreatif"], score: "Baru" },
]

export function PopularIdeasSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-2xl font-semibold md:text-3xl">Ide Populer</h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          Cuplikan ide yang sedang dibicarakan. Data ini placeholder—akan terhubung ke API Forum.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {ideas.map((idea) => (
          <Card key={idea.title} className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">{idea.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Label: </span>
                {idea.tags.join(", ")}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Status: </span>
                {idea.score}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-transparent">
                Lihat Detail
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
