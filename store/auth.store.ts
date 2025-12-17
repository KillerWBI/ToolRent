"use client";

import { api } from "@/lib/api/api";
import { refreshToken } from "@/lib/auth";
import axios from "axios";
import { create } from "zustand";

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthResponse {
    success?: boolean;
    data?: User;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;

    setUser: (user: User | null) => void;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    setUser: (user) =>
        set({
            user,
            isAuthenticated: !!user,
            loading: false,
        }),

    fetchUser: async () => {
        set({ loading: true });

        try {
            // пробуємо отримати користувача
            const res = await api.get<AuthResponse>("/api/auth/me");

            // Бекенд повертає {success: true, data: {...}} або прямі дані користувача
            const userData = res.data?.data || (res.data as User);

            set({
                user: res.data,
                isAuthenticated: true,
                loading: false,
            });
        } catch (error: unknown) {
            // якщо access token помер → пробуємо refresh
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    try {
                        // повторюємо запит після refresh
                        const res = await api.get<AuthResponse>("/api/auth/me");

                        // Бекенд повертає {success: true, data: {...}} або прямі дані користувача
                        const userData = res.data?.data || (res.data as User);

                        set({
                            user: userData,
                            isAuthenticated: true,
                            loading: false,
                        });
                        return;
                    } catch (err) {
                        console.error("Auth fetch after refresh failed:", err);
                    }
                }
            }

            // refresh не допоміг або інша помилка → logout
            console.warn("User not authenticated", error);
            set({
                user: null,
                isAuthenticated: false,
                loading: false,
            });
            return;
          }
        }
    },

    logout: async () => {
        try {
            await api.post("/api/auth/logout", {}, { withCredentials: true });
        } catch (error) {
            console.warn("Logout failed on server, cleaning locally", error);
        } finally {
            set({
                user: null,
                isAuthenticated: false,
            });
            if (typeof window !== "undefined") {
                document.cookie =
                    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
            }
        }
    },
}));

// Backwards-compatible alias
export const useAuth = useAuthStore;
