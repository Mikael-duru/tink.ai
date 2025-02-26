import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
	try {
		const { publicId } = await req.json();

		if (!publicId) {
			return NextResponse.json(
				{ error: "No public ID provided" },
				{ status: 400 }
			);
		}

		// Delete image from Cloudinary
		await cloudinary.uploader.destroy(publicId);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Delete error:", error);
		return NextResponse.json(
			{ error: "Image deletion failed" },
			{ status: 500 }
		);
	}
}
