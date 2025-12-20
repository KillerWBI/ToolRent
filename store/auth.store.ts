"use client";

import { AuthMe, refreshToken } from "@/lib/auth";
import axios from "axios";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;

  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  fetchUser: async () => {
    set({ loading: true });

    try {
      const rawUser = await AuthMe();

      const user = rawUser
        ? { ...rawUser, id: rawUser.id ?? rawUser._id }
        : null;

      set({
        user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      // ⬇️ если access token умер — пробуем refresh
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          await refreshToken();

          const rawUser = await AuthMe();
          const user = rawUser
            ? { ...rawUser, id: rawUser.id ?? rawUser._id }
            : null;

          set({
            user,
            isAuthenticated: true,
            loading: false,
          });
          return;
        } catch (err) {
          // refresh тоже умер — падаем ниже
          console.error("Refresh failed", err);
        }
      }

      // ❌ если вообще не удалось
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  logout: async () => {
    try {
      // если у тебя есть logout endpoint — можешь вызвать тут
      // await apiAuth.post("/api/auth/logout");
    } finally {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));

export const useAuth = useAuthStore;
