import { Link } from "@inertiajs/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Category = {
    id: number
    name: string
    slug: string
}

type ForumPost = {
  id: string
  title: string
  description: string
  image?: string | null
  category: Category
  tags: string[]
  slug: string
  likesCount: number
  commentsCount: number
  createdAt: string
}


export function ForumCard({ post }: { post: ForumPost }) {
  return (
    <Link 
        href={`/forum/${post.slug}`}
        aria-label={`Baca lebih lanjut tentang ${post.title}`}
        className="block rounded-md focus:ring-2 focus:ring-primary focus:outline-none">
            <Card className="flex flex-col gap-0 h-full overflow-hidden py-0">
                {post.image && (
                    <img
                        src={post.image}
                        alt={`Gambar untuk ${post.title}`}
                        className="w-full h-40 object-cover" 
                    />
                )}

                <div className="flex flex-col flex-grow p-6">
                    <CardHeader className="p-0">
                        <CardTitle className="text-lg hover:underline">
                            {post.title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0 pt-4 flex-grow"> 
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">{post.category.name}</Badge>
                            {(Array.isArray(post.tags) ? post.tags : JSON.parse(post.tags || "[]"))
                            .slice(0, 3)
                            .map((t: string) => (
                                <Badge key={t} variant="outline">
                                    {t}
                                </Badge>
                            ))}
                        </div>
                        <p className="line-clamp-3 text-sm text-muted-foreground mt-3">{post.description}</p>
                    </CardContent>

                    <CardFooter className="p-0 pt-4 mt-auto mb-0"> 
                        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <div className="flex items-center gap-3">
                                <span aria-label="Jumlah suka">👍 {post.likesCount}</span>
                                <span aria-label="Jumlah komentar">💬 {post.commentsCount}</span>
                            </div>
                        </div>
                    </CardFooter>
                </div>
            </Card>
    </Link>
  )
}
