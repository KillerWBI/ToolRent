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

export interface Tool {
    _id: string;
    name: string;
    description: string;
    pricePerDay: number;
    images: string[];
    terms: string;
    // Specifications приходить як об'єкт { "Ключ": "Значення" }
    specifications?: Record<string, string>;
    rating: number;
    category: Category; // Populate
    owner: UserInfo; // Populate
    feedbacks?: Feedback[]; // Populate (якщо запитуємо getToolById)
    bookedDates?: { from: string; to: string }[];
    createdAt: string;
    updatedAt: string;
}
