"use client";

import { api } from "@/lib/api/api";
import { refreshToken } from "@/lib/auth";
import { create } from "zustand";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;

  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

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
      // пробуем получить пользователя
      const res = await api.get<User>("/api/auth/me");
      set({
        user: res.data,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error: unknown) {
      // если access token умер → пробуем refresh
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          try {
            const res = await api.get<User>("/api/auth/me");
            set({
              user: res.data,
              isAuthenticated: true,
              loading: false,
            });
            return;
          } catch (err) {
            console.error("Auth fetch after refresh failed:", err);
          }
        }
      }

      console.warn("User not authenticated", error);
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
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
