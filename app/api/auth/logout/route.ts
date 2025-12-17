// app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function POST(req: NextRequest) {
  if (!API_URL) {
    return NextResponse.json(
      { message: "API_URL not configured" },
      { status: 500 }
    );
  }

  try {
    // 1️⃣ дергаем реальный backend logout (опционально, но правильно)
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    // 2️⃣ УДАЛЯЕМ КУКИ ПРАВИЛЬНО
    const cookieStore = await cookies();

    cookieStore.set({
      name: "accessToken",
      value: "",
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    cookieStore.set({
      name: "refreshToken",
      value: "",
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    cookieStore.set({
      name: "sessionId",
      value: "",
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Auth logout proxy error:", error);
    return NextResponse.json(
      { message: "Не вдалося вийти" },
      { status: 500 }
    );
  }
}
