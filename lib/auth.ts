// lib/auth.client.ts
import { api } from "@/lib/api/api";

export async function refreshToken(): Promise<boolean> {
  try {
    await api.post("/api/auth/refresh"); // 👉 Next proxy
    return true;
  } catch {
    return false;
  }
}
