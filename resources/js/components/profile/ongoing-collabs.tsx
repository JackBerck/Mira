/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Table, TableCell, TableHead, TableRow } from "../ui/table"
import { Link } from "@inertiajs/react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function OngoingCollabs() {
  const { data } = useSWR("/api/profile/ongoing-collabs", fetcher)

  return (
    <Table>
      <TableHead>
        <TableCell className="col-span-5">Kolaborasi</TableCell>
        <TableCell className="col-span-2">Status</TableCell>
        <TableCell className="col-span-2">Progress</TableCell>
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
            <TableCell className="col-span-2">{c.progress}%</TableCell>
            <TableCell className="col-span-3 flex items-center justify-end gap-2">
              <Button asChild variant="secondary" size="sm">
                <Link href={`/kolaborasi/${c.id}?manage=1`}>Kelola</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/kolaborasi/${c.id}?tab=tasks`}>Task Board</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </div>
    </Table>
  )
}
