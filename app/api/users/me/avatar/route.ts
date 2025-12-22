import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function PATCH(req: NextRequest) {
  if (!API_URL) {
    return NextResponse.json(
      { message: "API_URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();

    const res = await fetch(`${API_URL}/api/users/me/avatar`, {
      method: "PATCH",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
      body: formData,
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text || "Unexpected response" };
    }

    const nextRes = NextResponse.json(data, { status: res.status });

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      nextRes.headers.set("set-cookie", setCookie);
    }

    return nextRes;
  } catch (error) {
    console.error("Avatar update proxy error:", error);
    return NextResponse.json(
      { message: "Не вдалося оновити аватар" },
      { status: 500 }
    );
  }
}
