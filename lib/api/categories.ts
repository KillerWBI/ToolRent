import { Category } from "@/types/category";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const getCategories = async (
  signal?: AbortSignal
): Promise<Category[]> => {
  const res = await fetch(`${API_URL}/api/categories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    signal,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch categories");
  }

  const json = await res.json();

  return json.data as Category[];
};
