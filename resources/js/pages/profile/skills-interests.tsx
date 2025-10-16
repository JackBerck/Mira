import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProfileLayout from '@/layouts/profile-layout';
import { parseArray } from '@/utils/helpers';
import { useForm } from '@inertiajs/react';
import { Check, Plus, Star, X } from 'lucide-react';
import { useMemo, useState } from 'react';

interface SkillsInterestsProps {
    user: {
        name: string;
        skills: string[] | string;
        interests: string[] | string;
    };
    status?: string;
}

const popularSkills = [
    'JavaScript',
    'Python',
    'React',
    'Node.js',
    'UI/UX Design',
    'Digital Marketing',
    'Data Analysis',
    'Project Management',
    'Content Writing',
    'Graphic Design',
    'Mobile Development',
    'Machine Learning',
    'SEO',
    'Social Media Marketing',
    'Photography',
];

const popularInterests = [
    'Startup',
    'Technology',
    'Sustainability',
    'Education',
    'Healthcare',
    'Fintech',
    'E-commerce',
    'Social Impact',
    'AI & ML',
    'Blockchain',
    'Climate Change',
    'Digital Transformation',
    'Innovation',
    'Entrepreneurship',
    'Community Building',
];

export default function SkillsInterests({
    user,
    status,
}: SkillsInterestsProps) {
    const [skillInput, setSkillInput] = useState('');
    const [interestInput, setInterestInput] = useState('');

    // Parse skills and interests safely
    const userSkills = useMemo(() => parseArray(user.skills), [user.skills]);
    const userInterests = useMemo(
        () => parseArray(user.interests),
        [user.interests],
    );

    const { data, setData, put, processing, errors } = useForm({
        skills: userSkills,
        interests: userInterests,
    });

    const addSkill = (skill: string) => {
        if (skill && !data.skills.includes(skill)) {
            setData('skills', [...data.skills, skill]);
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setData(
            'skills',
            data.skills.filter((skill) => skill !== skillToRemove),
        );
    };

    const addInterest = (interest: string) => {
        if (interest && !data.interests.includes(interest)) {
            setData('interests', [...data.interests, interest]);
            setInterestInput('');
        }
    };

    const removeInterest = (interestToRemove: string) => {
        setData(
            'interests',
            data.interests.filter((interest) => interest !== interestToRemove),
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/profile/skills-interests');
    };

    return (
        <ProfileLayout title="Keahlian & Minat">
            <div className="space-y-6">
                {/* Status Message */}
                {status === 'skills-updated' && (
                    <Alert className="border-green-200 bg-green-50">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Keahlian dan minat berhasil diperbarui!
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* Skills Section */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <Star className="mr-2 h-5 w-5 text-yellow-500" />
                                Keahlian
                            </CardTitle>
                            <p className="text-sm text-gray-600">
                                Tambahkan keahlian yang Anda kuasai untuk
                                membantu dalam pencocokan kolaborasi
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Add Skills */}
                            <div className="space-y-3">
                                <Label>Tambah Keahlian</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={skillInput}
                                        onChange={(e) =>
                                            setSkillInput(e.target.value)
                                        }
                                        placeholder="Ketik keahlian Anda..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSkill(skillInput);
                                            }
                                        }}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => addSkill(skillInput)}
                                        disabled={!skillInput.trim()}
                                        size="sm"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Popular Skills */}
                            <div className="space-y-3">
                                <Label className="text-sm text-gray-700">
                                    Pilih dari keahlian populer:
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {popularSkills.map((skill) => (
                                        <Badge
                                            key={skill}
                                            variant={
                                                data.skills.includes(skill)
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className={`cursor-pointer transition-colors ${
                                                data.skills.includes(skill)
                                                    ? 'bg-blue-600 hover:bg-blue-700'
                                                    : 'hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                            onClick={() => {
                                                if (
                                                    data.skills.includes(skill)
                                                ) {
                                                    removeSkill(skill);
                                                } else {
                                                    addSkill(skill);
                                                }
                                            }}
                                        >
                                            {skill}
                                            {data.skills.includes(skill) && (
                                                <Check className="ml-1 h-3 w-3" />
                                            )}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Current Skills */}
                            {data.skills.length > 0 && (
                                <div className="space-y-3">
                                    <Label className="text-sm text-gray-700">
                                        Keahlian Anda ({data.skills.length}):
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {data.skills.map((skill) => (
                                            <Badge
                                                key={skill}
                                                className="bg-blue-600 pr-1 text-white"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeSkill(skill)
                                                    }
                                                    className="ml-2 rounded-full p-0.5 hover:bg-blue-700"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {errors.skills && (
                                <p className="text-sm text-red-600">
                                    {errors.skills}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Interests Section */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <div className="mr-2 h-5 w-5 rounded bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                Minat & Area Fokus
                            </CardTitle>
                            <p className="text-sm text-gray-600">
                                Pilih bidang atau topik yang menarik minat Anda
                                untuk kolaborasi
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Add Interests */}
                            <div className="space-y-3">
                                <Label>Tambah Minat</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={interestInput}
                                        onChange={(e) =>
                                            setInterestInput(e.target.value)
                                        }
                                        placeholder="Ketik area minat Anda..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addInterest(interestInput);
                                            }
                                        }}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            addInterest(interestInput)
                                        }
                                        disabled={!interestInput.trim()}
                                        size="sm"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Popular Interests */}
                            <div className="space-y-3">
                                <Label className="text-sm text-gray-700">
                                    Pilih dari minat populer:
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {popularInterests.map((interest) => (
                                        <Badge
                                            key={interest}
                                            variant={
                                                data.interests.includes(
                                                    interest,
                                                )
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className={`cursor-pointer transition-colors ${
                                                data.interests.includes(
                                                    interest,
                                                )
                                                    ? 'bg-purple-600 hover:bg-purple-700'
                                                    : 'hover:border-purple-300 hover:bg-purple-50'
                                            }`}
                                            onClick={() => {
                                                if (
                                                    data.interests.includes(
                                                        interest,
                                                    )
                                                ) {
                                                    removeInterest(interest);
                                                } else {
                                                    addInterest(interest);
                                                }
                                            }}
                                        >
                                            {interest}
                                            {data.interests.includes(
                                                interest,
                                            ) && (
                                                <Check className="ml-1 h-3 w-3" />
                                            )}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Current Interests */}
                            {data.interests.length > 0 && (
                                <div className="space-y-3">
                                    <Label className="text-sm text-gray-700">
                                        Minat Anda ({data.interests.length}):
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {data.interests.map((interest) => (
                                            <Badge
                                                key={interest}
                                                className="bg-purple-600 pr-1 text-white"
                                            >
                                                {interest}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeInterest(interest)
                                                    }
                                                    className="ml-2 rounded-full p-0.5 hover:bg-purple-700"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {errors.interests && (
                                <p className="text-sm text-red-600">
                                    {errors.interests}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>

                {/* Tips Card */}
                <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm">
                    <CardContent className="p-6">
                        <h3 className="mb-3 font-semibold text-gray-900">
                            💡 Tips untuk Profile yang Menarik
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>
                                • Tambahkan 5-10 keahlian utama yang benar-benar
                                Anda kuasai
                            </li>
                            <li>
                                • Pilih minat yang spesifik dan sesuai dengan
                                tujuan kolaborasi Anda
                            </li>
                            <li>
                                • Update keahlian secara berkala seiring
                                perkembangan skill Anda
                            </li>
                            <li>
                                • Kombinasikan technical skills dengan soft
                                skills untuk profil yang seimbang
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </ProfileLayout>
    );
}
