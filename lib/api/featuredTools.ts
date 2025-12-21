import { Tool } from "@/types/tool";

/**
 * SSR-safe fetch of featured tools with revalidation.
 * Supports multiple backend shapes: { tools }, { data: { tools } }, or plain array.
 */
export async function getFeaturedTools(): Promise<Tool[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch tools: ${res.status}`);
    }

    const data = await res.json();

    const tools =
      (data as any)?.tools ||
      (data as any)?.data?.tools ||
      (Array.isArray(data) ? data : []);

    if (!Array.isArray(tools)) {
      console.error("Unexpected tools response shape", data);
      return [];
    }

    return tools as Tool[];
  } catch (error) {
    console.error("Error fetching featured tools:", error);
    return [];
  }
}
