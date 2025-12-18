// lib/api/users.ts
import type { Tool } from "@/types/tool";

export type PublicUser = {
  _id: string;
  name: string;
  avatarUrl?: string;
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getPublicUserById(userId: string): Promise<PublicUser> {
  const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
    // профіль можна кешувати або ні — на час розробки краще вимкнути кеш
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getUserToolsByUserId(userId: string): Promise<Tool[]> {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/tools`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch user tools: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}
