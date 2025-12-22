export interface Category {
    _id: string;
    title: string;
    description?: string;
}

export interface UserInfo {
    _id: string;
    name: string;
    avatarUrl?: string;
    email?: string;
    rating?: number;
}

export interface Feedback {
    _id: string;
    rate: number;
    description: string;
    owner: UserInfo; // Populate
    createdAt: string;
}

export type Tool = {
    _id: string;
    owner: string;
    category: string;
    name: string;
    description: string;
    pricePerDay: number;
    images: string[] | string; // Масив зображень (1-5) або string для сумісності зі старими даними
    rating?: number;
    specifications?: Record<string, string>;
    rentalTerms?: string;
    feedbacks?: Feedback[];
};
