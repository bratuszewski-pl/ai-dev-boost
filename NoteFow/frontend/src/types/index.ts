export interface User {
    id: string;
    username: string;
}

export interface Note {
    id: string;
    userId: string;
    content: {
        text: string;
        links: string[];
        images: any[];
    };
    title: string;
    categoryId?: string;
    categoryName?: string;
    tags: string[];
    keywords: string[];
    aiAnalysisStatus: 'pending' | 'completed' | 'failed';
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    noteCount?: number;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}
