import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProfileLayout from '@/layouts/profile-layout';
import { Link, router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle,
    Clock,
    Eye,
    MessageSquare,
    User,
    UserPlus,
    Users,
} from 'lucide-react';

interface Collaboration {
    id: number;
    title: string;
    slug: string;
    description: string;
    skills_needed: string[];
    status: 'open' | 'in_progress' | 'completed';
    image?: string;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    user: {
        id: number;
        name: string;
    };
    collaborators_count: number;
    chats_count: number;
    user_role: string;
    created_at: string;
    joined_at: string;
}

interface FollowedCollaborationsProps {
    followedCollaborations: {
        data: Collaboration[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function FollowedCollaborations({
    followedCollaborations,
}: FollowedCollaborationsProps) {
    const collaborationsData = followedCollaborations?.data || [];
    const collaborationsTotal = followedCollaborations?.total || 0;
    const collaborationsCurrentPage = followedCollaborations?.current_page || 1;
    const collaborationsLastPage = followedCollaborations?.last_page || 1;

    const statusConfig = {
        open: {
            label: 'Terbuka',
            color: 'bg-green-100 text-green-800',
            icon: <Clock className="h-3 w-3" />,
        },
        in_progress: {
            label: 'Berlangsung',
            color: 'bg-blue-100 text-blue-800',
            icon: <Users className="h-3 w-3" />,
        },
        completed: {
            label: 'Selesai',
            color: 'bg-gray-100 text-gray-800',
            icon: <CheckCircle className="h-3 w-3" />,
        },
    };

    const roleConfig = {
        member: { label: 'Anggota', color: 'bg-blue-100 text-blue-800' },
        leader: { label: 'Pemimpin', color: 'bg-purple-100 text-purple-800' },
        coordinator: {
            label: 'Koordinator',
            color: 'bg-orange-100 text-orange-800',
        },
        contributor: {
            label: 'Kontributor',
            color: 'bg-green-100 text-green-800',
        },
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const getRoleInfo = (role: string) => {
        return roleConfig[role as keyof typeof roleConfig] || roleConfig.member;
    };

    return (
        <ProfileLayout title="Kolaborasi yang Diikuti">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Kolaborasi yang Diikuti
                        </h2>
                        <p className="text-gray-600">
                            Semua proyek kolaborasi yang Anda ikuti (
                            {collaborationsTotal} total)
                        </p>
                    </div>

                    <Link href="/kolaborasi">
                        <Button className="bg-purple-600 hover:bg-purple-700">
                            <Eye className="mr-2 h-4 w-4" />
                            Jelajahi Kolaborasi
                        </Button>
                    </Link>
                </div>

                {/* Collaborations List */}
                {collaborationsData.length > 0 ? (
                    <div className="space-y-4">
                        {collaborationsData.map((collaboration) => {
                            const status =
                                statusConfig[collaboration.status] ||
                                statusConfig.open;
                            const role = getRoleInfo(collaboration.user_role);

                            return (
                                <Card
                                    key={collaboration.id}
                                    className="border-0 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            {/* Collaboration Image */}
                                            {collaboration.image && (
                                                <div className="hidden h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg sm:block">
                                                    <img
                                                        src={
                                                            collaboration.image
                                                        }
                                                        alt={
                                                            collaboration.title
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            {/* Collaboration Content */}
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-3 flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <Link
                                                            href={`/beranda/kolaborasi/${collaboration.slug}`}
                                                            className="block"
                                                        >
                                                            <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 transition-colors hover:text-purple-600">
                                                                {
                                                                    collaboration.title
                                                                }
                                                            </h3>
                                                        </Link>

                                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {collaboration
                                                                    .category
                                                                    ?.name ||
                                                                    'Tanpa Kategori'}
                                                            </Badge>
                                                            <Badge
                                                                className={`text-xs ${status.color} flex items-center gap-1`}
                                                            >
                                                                {status.icon}
                                                                {status.label}
                                                            </Badge>
                                                            <Badge
                                                                className={`text-xs ${role.color} flex items-center gap-1`}
                                                            >
                                                                <UserPlus className="h-3 w-3" />
                                                                {role.label}
                                                            </Badge>
                                                            <div className="flex items-center">
                                                                <User className="mr-1 h-3 w-3" />
                                                                {collaboration
                                                                    .user
                                                                    ?.name ||
                                                                    'Anonymous'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action */}
                                                    <div className="ml-4 flex items-center gap-2">
                                                        <Link
                                                            href={`/beranda/kolaborasi/${collaboration.slug}`}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>

                                                <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                                                    {collaboration.description}
                                                </p>

                                                {/* Skills Needed */}
                                                {collaboration.skills_needed &&
                                                    Array.isArray(
                                                        collaboration.skills_needed,
                                                    ) &&
                                                    collaboration.skills_needed
                                                        .length > 0 && (
                                                        <div className="mb-3 flex flex-wrap gap-2">
                                                            <span className="text-xs font-medium text-gray-500">
                                                                Skills:
                                                            </span>
                                                            {collaboration.skills_needed
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        skill,
                                                                        index,
                                                                    ) => (
                                                                        <Badge
                                                                            key={
                                                                                index
                                                                            }
                                                                            variant="secondary"
                                                                            className="text-xs"
                                                                        >
                                                                            {
                                                                                skill
                                                                            }
                                                                        </Badge>
                                                                    ),
                                                                )}
                                                            {collaboration
                                                                .skills_needed
                                                                .length > 3 && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    +
                                                                    {collaboration
                                                                        .skills_needed
                                                                        .length -
                                                                        3}{' '}
                                                                    lagi
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}

                                                {/* Stats and Joined Info */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <Users className="mr-1 h-4 w-4" />
                                                            {collaboration.collaborators_count ||
                                                                0}{' '}
                                                            kolaborator
                                                        </div>
                                                        <div className="flex items-center">
                                                            <MessageSquare className="mr-1 h-4 w-4" />
                                                            {collaboration.chats_count ||
                                                                0}{' '}
                                                            diskusi
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Calendar className="mr-1 h-4 w-4" />
                                                            Dibuat{' '}
                                                            {formatDate(
                                                                collaboration.created_at,
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        Bergabung{' '}
                                                        {formatDate(
                                                            collaboration.joined_at,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <Users className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                                Belum Mengikuti Kolaborasi
                            </h3>
                            <p className="mx-auto mb-6 max-w-md text-gray-600">
                                Anda belum mengikuti kolaborasi manapun.
                                Bergabunglah dengan proyek-proyek menarik dan
                                berkontribusi bersama komunitas!
                            </p>
                            <Link href="/kolaborasi">
                                <Button className="bg-purple-600 hover:bg-purple-700">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Jelajahi Kolaborasi
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {collaborationsLastPage > 1 && (
                    <div className="flex justify-center">
                        <div className="flex items-center space-x-2">
                            {Array.from(
                                { length: collaborationsLastPage },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === collaborationsCurrentPage
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get(
                                            '/profile/followed-collaborations',
                                            { page },
                                        )
                                    }
                                    className="h-10 w-10"
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ProfileLayout>
    );
}
