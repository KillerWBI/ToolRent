// lib/auth.client.ts
import axios from "axios";

export const apiAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export async function refreshToken() {
  try {
    const response = await apiAuth.post("/api/auth/refresh");
    return response.data;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
}

export async function AuthMe() {
  try {
    const response = await apiAuth.get("/api/users/me");
    return response.data;
  } catch (error) {
    console.error("Dont found token", error);
    throw error;
  }
}
