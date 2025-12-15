"use client";

import axios from "axios";
import { create } from "zustand";
interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;

  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;
// ⚠️ ВАЖНО: для client-side всегда NEXT_PUBLIC_

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
      const res = await axios.get<User>(`${API_URL}/me`, {
        withCredentials: true,
      });

      set({
        user: res.data,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      console.warn(error + "Auth: user not authenticated");

      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  logout: async () => {
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        { withCredentials: true }
      );
    } catch {
      // даже если сервер упал — чистим локально
    }

    set({
      user: null,
      isAuthenticated: false,
    });

    if (typeof window !== "undefined") {
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    }
  },
}));

// Backwards-compatible alias: some files import `useAuth`
export const useAuth = useAuthStore;
