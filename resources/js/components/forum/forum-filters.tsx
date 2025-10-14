// import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Tipe data untuk kategori yang diterima dari props
interface Category {
    id: number;
    name: string;
    slug: string; 
}

// State untuk filter forum
export type ForumFilterState = {
    search: string;
    category: string; 
    sort: string;
};

// Props untuk komponen filter forum
interface ForumFiltersProps {
    value: ForumFilterState;
    categories: Category[]; 
    onChange: (filters: ForumFilterState) => void;
    onApply: () => void;
}

export function ForumFilters({
    value,
    categories,
    onChange,
    onApply,
}: ForumFiltersProps) {
    return (
        <div className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground">
            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <Label htmlFor="search">Cari Topik</Label>
                    <Input
                        id="search"
                        placeholder="Cari berdasarkan judul atau tag..."
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
                            <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.slug}>
                                    {cat.name}
                                </SelectItem>
                            ))}
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
                            <SelectValue placeholder="Urutkan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="latest">Terbaru</SelectItem>
                            <SelectItem value="oldest">Terlama</SelectItem>
                            <SelectItem value="popularity">Paling Populer</SelectItem>
                            <SelectItem value="most_comments">Paling Banyak Dikomentari</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {/* <div className="flex justify-end pt-2">
                <Button onClick={onApply}>Terapkan Filter</Button>
            </div> */}
        </div>
    );
}