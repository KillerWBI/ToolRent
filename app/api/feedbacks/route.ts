import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const backendBase = process.env.NEXT_PUBLIC_API_URL;

  if (!backendBase) {
    return NextResponse.json(
      { message: "Backend URL is not configured" },
      { status: 500 }
    );
  }

  const cookie = req.headers.get("cookie") ?? "";
  const authorization = req.headers.get("authorization") ?? undefined;

  // ожидаем JSON, а не FormData
  const body = await req.json();

  try {
    const res = await fetch(`${backendBase}/api/feedbacks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie,
        ...(authorization ? { authorization } : {}),
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Create feedback failed" },
      { status: 500 }
    );
  }
}
