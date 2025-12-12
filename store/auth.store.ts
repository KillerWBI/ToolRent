import { create } from "zustand";

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  logout: () => {
    set({ user: null });
    if (typeof window !== "undefined") {
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;";
    }
  },
}));
