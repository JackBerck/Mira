/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import useSWR from 'swr';
import { Table, TableCell, TableHead, TableRow } from '../ui/table';
import { Link } from '@inertiajs/react';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function CommentsTable() {
    const { data } = useSWR('/api/profile/comments', fetcher);

    return (
        <Table>
            <TableHead>
                <TableCell className="col-span-6">Forum</TableCell>
                <TableCell className="col-span-3">Komentar Saya</TableCell>
                <TableCell className="col-span-3 text-right">Aksi</TableCell>
            </TableHead>
            <div className="divide-y">
                {(data?.items || []).map((f: any) => (
                    <TableRow key={f.id}>
                        <TableCell className="col-span-6">
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
                        <TableCell className="col-span-3 line-clamp-1">
                            {f.myComment}
                        </TableCell>
                        <TableCell className="col-span-3 flex items-center justify-end gap-2">
                            <Button asChild variant="secondary" size="sm">
                                <Link href={`/forum/${f.id}`}>Buka</Link>
                            </Button>
                            <Button variant="outline" size="sm">
                                <Link href={`/forum/${f.id}#comments`}>
                                    Lihat Komentar
                                </Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </div>
        </Table>
    );
}
