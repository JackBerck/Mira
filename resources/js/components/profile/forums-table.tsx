/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import useSWR from 'swr';
import { Table, TableCell, TableHead, TableRow } from '../ui/table';
import { Link } from '@inertiajs/react';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ForumsTable() {
    const { data } = useSWR('/api/profile/forums', fetcher);

    return (
        <Table>
            <TableHead>
                <TableCell className="col-span-5">Judul</TableCell>
                <TableCell className="col-span-2">Kategori</TableCell>
                <TableCell className="col-span-2">Statistik</TableCell>
                <TableCell className="col-span-3 text-right">Aksi</TableCell>
            </TableHead>
            <div className="divide-y">
                {(data?.items || []).map((f: any) => (
                    <TableRow key={f.id}>
                        <TableCell className="col-span-5">
                            <Link
                                href={`/forum/${f.id}`}
                                className="font-medium underline"
                            >
                                {f.title}
                            </Link>
                            <p className="line-clamp-1 text-xs text-muted-foreground">
                                {f.excerpt}
                            </p>
                        </TableCell>
                        <TableCell className="col-span-2">{f.category}</TableCell>
                        <TableCell className="col-span-2">
                            {f.likes} suka · {f.comments} komentar
                        </TableCell>
                        <TableCell className="col-span-3 flex items-center justify-end gap-2">
                            <Button asChild variant="secondary" size="sm">
                                <Link href={`/forum/${f.id}`}>Lihat</Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/forum/${f.id}?edit=1`}>Edit</Link>
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => alert('Hapus forum (mock)')}
                            >
                                Hapus
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </div>
        </Table>
    );
}
