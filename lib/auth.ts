// lib/auth.ts (server)
export async function verifyTokenOnServer(token?: string) {
  if (!token) return null;
  // При необходимости — серверный fetch к вашему API:
  const res = await fetch(`${process.env.API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}
