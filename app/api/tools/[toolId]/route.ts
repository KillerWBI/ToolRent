import { NextRequest, NextResponse } from "next/server";

// In Next.js App Router (newer versions), route handler params are async.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ toolId: string }> }
) {
  const { toolId } = await params;
  const backendBase = process.env.NEXT_PUBLIC_API_URL;

  if (!backendBase) {
    return NextResponse.json(
      { message: "Backend URL is not configured" },
      { status: 500 }
    );
  }

  const url = `${backendBase}/api/tools/${toolId}`;

  // Forward cookies (and Authorization if present) for auth
  const cookie = req.headers.get("cookie") ?? "";
  const authorization = req.headers.get("authorization") ?? undefined;

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        cookie,
        ...(authorization ? { authorization } : {}),
      },
      // No need for credentials in server-side fetch
    });

    const text = await res.text();
    // Pass-through status and body from backend
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Delete failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ toolId: string }> }
) {
  const { toolId } = await params;
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
    const res = await fetch(`${backendBase}/api/tools/${toolId}`, {
      method: "PATCH",
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
      { message: (error as Error).message || "Update failed" },
      { status: 500 }
    );
  }
}
