import { NextRequest, NextResponse } from "next/server";

const API_URL =  process.env.NEXT_PUBLIC_API_URL || "https://toolsbackend-zzml.onrender.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(
      `${API_URL}/api/auth/request-reset-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (error) {
    console.error("Proxy error:", error);

    return NextResponse.json(
      { message: "Не вдалося з'єднатися з сервером" },
      { status: 500 }
    );
  }
}