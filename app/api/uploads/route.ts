import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const images: string[] = Array.isArray(body?.images) ? body.images : [];

    if (!images.length) {
      return NextResponse.json(
        { message: "No images provided" },
        { status: 400 }
      );
    }

    const uploadResults: string[] = [];
    for (const dataUrl of images) {
      // Upload data URL directly to Cloudinary
      const res = await cloudinary.uploader.upload(dataUrl, {
        folder: "tools",
        overwrite: false,
        resource_type: "image",
      });
      uploadResults.push(res.secure_url);
    }

    return NextResponse.json({ urls: uploadResults }, { status: 200 });
  } catch (error) {
    const message = (error as Error)?.message || "Upload failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
