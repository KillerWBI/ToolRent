"use client";

import { api } from "@/lib/api/api";
import { refreshToken } from "@/lib/auth";
import axios from "axios";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

interface AuthResponse {
  success?: boolean;
  data?: User;
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
      const res = await api.get<AuthResponse>("/api/auth/me");
      const rawUser = res.data.data ?? (res.data as unknown as User);
      const user = rawUser
        ? { ...rawUser, id: rawUser.id ?? (rawUser as any)._id }
        : null;

      set({
        user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        const refreshed = await refreshToken();

        if (refreshed) {
          try {
            const res = await api.get<AuthResponse>("/api/auth/me");
            const rawUser = res.data.data ?? (res.data as unknown as User);
            const user = rawUser
              ? { ...rawUser, id: rawUser.id ?? (rawUser as any)._id }
              : null;

            set({
              user,
              isAuthenticated: true,
              loading: false,
            });
            return;
          } catch (err) {
            console.error(err);
          }
        }
      }

      // ❗ если refresh не помог — просто считаем юзера разлогиненным
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  logout: async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      // ❗ НЕ ТРОГАЕМ cookie руками
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));

export const useAuth = useAuthStore;
