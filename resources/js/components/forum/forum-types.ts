export interface Forum {
    id: number;
    title: string;
    slug: string;
    description: string;
    tags: string[];
    image?: string;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
    likes_count: number;
    comments_count: number;
    created_at: string;
}
