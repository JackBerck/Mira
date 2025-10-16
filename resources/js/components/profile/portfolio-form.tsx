/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

type Item = { label: string; url: string };

export function PortfolioForm({
    initial,
    onSave,
    saving,
}: {
    initial: { portfolio: Item[] };
    onSave: (values: any) => Promise<void>;
    saving?: boolean;
}) {
    const [items, setItems] = useState<Item[]>(initial.portfolio || []);
    const [label, setLabel] = useState('');
    const [url, setUrl] = useState('');

    const add = () => {
        if (!label.trim() || !url.trim()) return;
        setItems((arr) => [...arr, { label: label.trim(), url: url.trim() }]);
        setLabel('');
        setUrl('');
    };

    const remove = (idx: number) =>
        setItems((arr) => arr.filter((_, i) => i !== idx));

    const save = async () => {
        await onSave({ portfolio: items });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="grid gap-2">
                    <Label htmlFor="label">Nama</Label>
                    <Input
                        id="label"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="Github Repo, Website, Dribbble"
                    />
                </div>
                <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://..."
                    />
                </div>
            </div>
            <Button type="button" onClick={add} aria-label="Tambah portofolio">
                Tambah
            </Button>

            <div className="divide-y rounded-md border">
                {items.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">
                        Belum ada item portofolio.
                    </div>
                ) : (
                    items.map((it, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-4"
                        >
                            <div className="min-w-0">
                                <p className="truncate font-medium">
                                    {it.label}
                                </p>
                                <a
                                    href={it.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="truncate text-sm text-primary underline"
                                >
                                    {it.url}
                                </a>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => remove(i)}
                                aria-label="Hapus"
                            >
                                Hapus
                            </Button>
                        </div>
                    ))
                )}
            </div>

            <Button
                onClick={save}
                disabled={saving}
                aria-label="Simpan portofolio"
            >
                {saving ? 'Menyimpan...' : 'Simpan Portofolio'}
            </Button>
        </div>
    );
}
