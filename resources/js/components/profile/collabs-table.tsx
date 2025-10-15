/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr"
import { Button } from "@/components/ui/button"

import { Link } from "@inertiajs/react"
import { Table, TableCell, TableHead, TableRow } from "../ui/table"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function CollabsTable() {
  const { data } = useSWR("/api/profile/collabs", fetcher)

  return (
    <Table>
      <TableHead>
        <TableCell className="col-span-5">Judul</TableCell>
        <TableCell className="col-span-2">Status</TableCell>
        <TableCell className="col-span-2">Anggota</TableCell>
        <TableCell className="col-span-3 text-right">Aksi</TableCell>
      </TableHead>
      <div className="divide-y">
        {(data?.items || []).map((c: any) => (
          <TableRow key={c.id}>
            <TableCell className="col-span-5">
              <Link href={`/kolaborasi/${c.id}`} className="font-medium underline">
                {c.title}
              </Link>
              <p className="line-clamp-1 text-xs text-muted-foreground">{c.excerpt}</p>
            </TableCell>
            <TableCell className="col-span-2">{c.status}</TableCell>
            <TableCell className="col-span-2">{c.members} orang</TableCell>
            <TableCell className="col-span-3 flex items-center justify-end gap-2">
              <Button asChild variant="secondary" size="sm">
                <Link href={`/kolaborasi/${c.id}`}>Lihat</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/kolaborasi/${c.id}?manage=1`}>Kelola</Link>
              </Button>
              <Button variant="destructive" size="sm" onClick={() => alert("Keluar kolaborasi (mock)")}>
                Keluar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </div>
    </Table>
  )
}
