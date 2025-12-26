import type { Tool } from "@/types/tool";

export type PublicUser = {
    _id: string;
    name: string;
    avatarUrl?: string;
    rating?: number;
    reviewsCount?: number;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Получить публичный профиль пользователя
 */
export async function getPublicUserById(userId: string): Promise<PublicUser> {
    const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(
            `Failed to fetch user: ${res.status} ${res.statusText}`
        );
    }

    const raw = await res.json();
    // Нормалізуємо id/_id для надійного використання в посиланнях
    const normalized = raw
        ? {
              ...raw,
              _id: (raw as any)._id ?? (raw as any).id,
              id: (raw as any).id ?? (raw as any)._id,
          }
        : raw;

    return normalized;
}

/**
 * Получить инструменты пользователя
 */
export async function getUserToolsByUserId(userId: string): Promise<Tool[]> {
    const res = await fetch(`${BASE_URL}/api/users/${userId}/tools`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(
            `Failed to fetch user tools: ${res.status} ${res.statusText}`
        );
    }

    return res.json();
}

/**
 * Отримати відгуки про користувача
 */
export async function getUserFeedbacksByUserId(userId: string): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/api/users/${userId}/feedbacks`, {
        cache: "no-store",
    });

    if (!res.ok) {
        // Якщо 404 або інша помилка, повертаємо порожній масив, щоб не ламати сторінку
        console.warn(`Failed to fetch user feedbacks: ${res.status}`);
        return [];
    }

    return res.json();
}
