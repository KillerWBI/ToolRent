// app/api/bookings/route.ts
import { NextResponse } from "next/server";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://toolsbackend-zzml.onrender.com";
export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch(
    `${API_URL}/api/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
