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
  const formData = await req.formData();

  try {
    const res = await fetch(`${backendBase}/api/tools`, {
      method: "POST",
      body: formData,
      headers: {
        cookie,
        ...(authorization ? { authorization } : {}),
      },
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
      { message: (error as Error).message || "Create failed" },
      { status: 500 }
    );
  }
}
