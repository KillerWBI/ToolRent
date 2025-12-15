import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://toolsbackend-zzml.onrender.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // { email, password }

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text || "Unexpected response format" };
    }

    const nextRes = NextResponse.json(data, { status: res.status });

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      nextRes.headers.set("set-cookie", setCookie);
    }

    return nextRes;
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { message: "Не вдалося з'єднатися з сервером входу" },
      { status: 500 }
    );
  }
}
