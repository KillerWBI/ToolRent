const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://toolsbackend-zzml.onrender.com";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    ...init,
    headers: { ...(init?.headers ?? {}) },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const apiGet = request;
