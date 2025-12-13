import { create } from "zustand";

interface User {
    id: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) => set({ user, isAuthenticated: !!user }),

    logout: () => {
        set({ user: null, isAuthenticated: false });
        if (typeof window !== "undefined") {
            document.cookie =
                "accessToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;";
        }
    },
}));
