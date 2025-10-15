import Layout from '@/layouts';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Forum {
    id: number;
    title: string;
    description: string;
    image: string | null;
    tags: string[];
    category: { name: string };
    slug: string;
    user: { name: string };
    comments: {
        id: number;
        content: string;
        created_at: string;
        user: { name: string };
    }[];
    likes_count: number;
    comments_count: number;
    created_at: string;
}

interface ForumShowProps {
    forum: Forum;
    isLiked: boolean;
}

export default function ForumShowPage({ forum, isLiked }: ForumShowProps) {
    const page = usePage();
    const { auth } = (page.props as unknown) as { auth: { user: { id: number; name: string } | null } };

    const { post: toggleLike, processing: liking } = useForm();
    
    const { data, setData, post: postComment, processing: commenting, errors, reset } = useForm({
        content: '',
    });

    const handleLike = () => {
        toggleLike(`/forum/${forum.id}/like`, { preserveScroll: true });
    };

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        postComment(`/forum/${forum.id}/comment`, {
            preserveScroll: true,
            onSuccess: () => reset('content'), 
        });
    };

    return (
        <Layout>
            <main className="container mx-auto px-12 py-8 md:py-12">
                <header>
                    <div className="flex items-center justify-between">
                        <Link href={'/forum'} className="text-sm text-primary hover:underline">
                            &larr; Kembali ke Forum
                        </Link>
                        {/* Logika untuk tombol "Bentuk Tim" */}
                    </div>
                    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                        <div>
                            <h1 className="mt-4 text-3xl font-bold md:text-4xl">{forum.title}</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Diposting oleh {forum.user.name} pada {new Date(forum.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/kolaborasi/buat">Buat Tim </Link>
                        </Button>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{forum.category.name}</Badge>
                        {(Array.isArray(forum.tags) ? forum.tags : []).map((tag) => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                    </div>
                </header>

                {/* Konten Artikel */}
                {forum.image && <img src={'/storage/' + forum.image} alt={forum.title} className="mt-8 h-100 w-full max-w-xl rounded-lg object-cover" />}
                <article className="prose mt-8 max-w-4xl dark:prose-invert">
                    <p>{forum.description}</p>
                </article>

                {/* Aksi Like */}
                <section className="mt-8 flex items-center gap-4 border-y py-4">
                    <Button onClick={handleLike} variant={isLiked ? "default" : "outline"} disabled={liking}>
                        👍 {isLiked ? 'Disukai' : 'Suka'} ({forum.likes_count})
                    </Button>
                    <span className="text-sm text-muted-foreground">💬 {forum.comments_count} Komentar</span>
                </section>

                {/* Bagian Komentar */}
                <section className="mt-12 max-w-3xl">
                    <h2 className="text-2xl font-semibold">Diskusi ({forum.comments_count})</h2>

                    {/* Form Komentar */}
                    {auth.user ? (
                        <form onSubmit={submitComment} className="mt-6 flex flex-col">
                            <Label htmlFor="content">Tulis Komentar Anda</Label>
                            <textarea
                                id="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="mt-2 border border-muted-foreground bg-transparent p-2 rounded-md"
                                rows={4}
                                placeholder="Bagikan pendapat Anda..."
                            />
                            {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
                            <Button type="submit" className="mt-4 self-end" disabled={commenting}>
                                {commenting ? 'Mengirim...' : 'Kirim Komentar'}
                            </Button>
                        </form>
                    ) : (
                        <p className="mt-6 text-sm text-muted-foreground">
                            <Link href="/login" className="text-primary hover:underline">Masuk</Link> untuk berpartisipasi dalam diskusi.
                        </p>
                    )}


                    {/* Daftar Komentar */}
                    <div className="mt-8 space-y-6">
                        {forum.comments.map((comment) => (
                            <Card key={comment.id}>
                                <CardHeader className="flex flex-row items-center justify-between p-4">
                                    <span className="font-semibold">{comment.user.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(comment.created_at).toLocaleString('id-ID')}
                                    </span>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-sm">{comment.content}</p>
                                </CardContent>
                            </Card>
                        ))}
                        {forum.comments.length === 0 && (
                            <p className="py-8 text-center text-sm text-muted-foreground">Jadilah yang pertama berkomentar!</p>
                        )}
                    </div>
                </section>
            </main>
        </Layout>
    );
}