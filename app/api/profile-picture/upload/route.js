import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
	try {
		const formData = await req.formData();
		const file = formData.get("file");

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Convert file to base64
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

		// Upload to Cloudinary
		const uploadResponse = await cloudinary.uploader.upload(base64Image, {
			folder: "profile_pictures",
			resource_type: "image",
		});

		return NextResponse.json({
			imageUrl: uploadResponse.secure_url,
			publicId: uploadResponse.public_id,
		});
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
	}
}
