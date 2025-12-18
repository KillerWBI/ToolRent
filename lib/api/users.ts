import { api} from "./api";
// import type { Tool } from "@/types/tool";

export type PublicUser = {
  _id: string;
  name: string;
  avatarUrl?: string;
};

export async function getPublicUserById(userId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("User not found");
  }

  return res.json();
}

// export async function getUserToolsByUserId(userId: string): Promise<Tool[]> {
//   return request<Tool[]>(`/api/users/${userId}/tools`);
// }
