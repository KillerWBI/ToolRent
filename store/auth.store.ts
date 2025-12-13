"use client";

import axios from "axios";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const API_URL = process.env.NEXT_SERVER_URL;

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  logout: () => {
    set({ user: null });
    if (typeof window !== "undefined") {
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;";
    }
  },

  fetchUser: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_URL}/me`, {
        withCredentials: true, // чтобы отправлять cookie
      });
      set({ user: res.data, loading: false });
    } catch (err) {
      console.error("Fetch user failed:", err);
      set({ user: null, loading: false });
    }
  },
}));
