/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export function SkillsInterests({
    initial,
    onSave,
    saving,
}: {
    initial: { skills: string[]; interests: string[] };
    onSave: (values: any) => Promise<void>;
    saving?: boolean;
}) {
    const [skills, setSkills] = useState<string[]>(initial.skills || []);
    const [interests, setInterests] = useState<string[]>(
        initial.interests || [],
    );
    const [skillInput, setSkillInput] = useState('');
    const [interestInput, setInterestInput] = useState('');

    const addItem = (type: 'skill' | 'interest') => {
        if (type === 'skill' && skillInput.trim()) {
            setSkills((s) => Array.from(new Set([...s, skillInput.trim()])));
            setSkillInput('');
        }
        if (type === 'interest' && interestInput.trim()) {
            setInterests((s) =>
                Array.from(new Set([...s, interestInput.trim()])),
            );
            setInterestInput('');
        }
    };

    const removeItem = (type: 'skill' | 'interest', item: string) => {
        if (type === 'skill') setSkills((s) => s.filter((x) => x !== item));
        if (type === 'interest')
            setInterests((s) => s.filter((x) => x !== item));
    };

    const saveAll = async () => {
        await onSave({ skills, interests });
    };

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-3">
                <Label htmlFor="add-skill">Tambah Skill</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="add-skill"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Contoh: React, UI/UX"
                    />
                    <Button
                        type="button"
                        onClick={() => addItem('skill')}
                        aria-label="Tambah skill"
                    >
                        Tambah
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                        <Badge
                            key={s}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeItem('skill', s)}
                            aria-label={`Hapus ${s}`}
                        >
                            {s}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <Label htmlFor="add-interest">Tambah Minat</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="add-interest"
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                        placeholder="Contoh: AI, Sosial"
                    />
                    <Button
                        type="button"
                        onClick={() => addItem('interest')}
                        aria-label="Tambah minat"
                    >
                        Tambah
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {interests.map((i) => (
                        <Badge
                            key={i}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeItem('interest', i)}
                            aria-label={`Hapus ${i}`}
                        >
                            {i}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="md:col-span-2">
                <Button
                    onClick={saveAll}
                    disabled={saving}
                    aria-label="Simpan keahlian dan minat"
                >
                    {saving ? 'Menyimpan...' : 'Simpan Keahlian & Minat'}
                </Button>
            </div>
        </div>
    );
}
