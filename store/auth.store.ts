"use client";

import { AuthMe, logoutUser, refreshToken } from "@/lib/auth";
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

    const attemptFetch = async (): Promise<User | null> => {
      try {
        const rawUser = await AuthMe();
        return rawUser
          ? { ...rawUser, id: rawUser.id ?? (rawUser as any)._id }
          : null;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null; // поймали 401 — нужно делать refresh
        }
        console.error("Fetch user failed", error);
        return null;
      }
    };

    let user = await attemptFetch();

    if (!user) {
      try {
        // 401 — пробуем обновить токен
        await refreshToken();
        user = await attemptFetch();
      } catch (err) {
        console.error("Refresh failed", err);
      }
    }

    set({
      user,
      isAuthenticated: !!user,
      loading: false,
    });
  },

  logout: async () => {
    try {
      await logoutUser(); // вызываем backend logout
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // чистим состояние на фронте
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export const useAuth = useAuthStore;
