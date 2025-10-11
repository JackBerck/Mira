import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export type CollabFilterState = {
    search: string;
    category: string;
    status: string;
    sort: string;
};

interface CollabFiltersProps {
    value: CollabFilterState;
    onChange: (filters: CollabFilterState) => void;
    onApply: () => void;
}

export function CollabFilters({
    value,
    onChange,
    onApply,
}: CollabFiltersProps) {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
                <div>
                    <Label htmlFor="search">Cari</Label>
                    <Input
                        id="search"
                        placeholder="Cari kolaborasi..."
                        value={value.search}
                        onChange={(e) =>
                            onChange({ ...value, search: e.target.value })
                        }
                        onKeyDown={(e) => e.key === 'Enter' && onApply()}
                    />
                </div>
                <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                        value={value.category}
                        onValueChange={(v) =>
                            onChange({ ...value, category: v })
                        }
                    >
                        <SelectTrigger id="category">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Semua">Semua</SelectItem>
                            <SelectItem value="Teknologi">Teknologi</SelectItem>
                            <SelectItem value="Sosial">Sosial</SelectItem>
                            <SelectItem value="Kreatif">Kreatif</SelectItem>
                            <SelectItem value="Lingkungan">
                                Lingkungan
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={value.status}
                        onValueChange={(v) => onChange({ ...value, status: v })}
                    >
                        <SelectTrigger id="status">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Semua">Semua</SelectItem>
                            <SelectItem value="open">Terbuka</SelectItem>
                            <SelectItem value="in_progress">
                                Sedang Berjalan
                            </SelectItem>
                            <SelectItem value="completed">Selesai</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="sort">Urutkan</Label>
                    <Select
                        value={value.sort}
                        onValueChange={(v) => onChange({ ...value, sort: v })}
                    >
                        <SelectTrigger id="sort">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="latest">Terbaru</SelectItem>
                            <SelectItem value="oldest">Terlama</SelectItem>
                            <SelectItem value="title">Judul</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex justify-end">
                <Button onClick={onApply}>Terapkan Filter</Button>
            </div>
        </div>
    );
}
