export type CollabStatus = 'open' | 'in-progress' | 'completed';
export type CollabCategory = 'Teknologi' | 'Sosial' | 'Kreatif' | 'Lingkungan';

export interface Collab {
    id: string;
    slug: string;
    title: string;
    description: string;
    category: CollabCategory;
    status: CollabStatus;
    membersCount: number;
    skillsNeeded: string[];
    forumId?: string;
    coverUrl?: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: number;
        name: string;
    };
}
