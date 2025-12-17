// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function POST(req: NextRequest) {
  if (!API_URL) {
    return NextResponse.json({ message: "API_URL not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    const text = await res.text();
    const nextRes = NextResponse.json(text ? JSON.parse(text) : {}, { status: res.status });

    // Очищаем куки в браузере
    nextRes.headers.set(
      "set-cookie",
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );

    return nextRes;
  } catch (error) {
    console.error("Auth logout proxy error:", error);
    return NextResponse.json({ message: "Не вдалося вийти" }, { status: 500 });
  }
}
