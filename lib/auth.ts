// lib/auth.ts (server)
import { cookies } from "next/headers";

export async function verifyAuthServer(): Promise<boolean> {
  const token = (await cookies()).get("accessToken")?.value;
  return Boolean(token);
}

