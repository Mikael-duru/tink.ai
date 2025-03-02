import { Loader2, Upload } from "lucide-react";
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";

import { db } from "@/firebase/firebase";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const ProfileImageUpload = ({ user, userDetails }) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleUpload = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		setIsLoading(true);

		try {
			const formData = new FormData();
			formData.append("file", file);

			// Upload to Cloudinary
			const uploadRes = await fetch("/api/profile-picture/upload", {
				method: "POST",
				body: formData,
			});

			const uploadData = await uploadRes.json();
			if (!uploadRes.ok) throw new Error(uploadData.error);

			const { imageUrl, publicId } = uploadData;

			const oldPublicId = userDetails?.imgPublicId || "";

			// Update Firestore with new image URL & public ID
			const userRef = doc(db, "users", user?.uid);

			await updateDoc(userRef, {
				photoURL: imageUrl,
				imgPublicId: publicId,
			});

			toast.success("Profile picture updated!");

			// Delete old image if it exists
			if (oldPublicId) {
				await fetch("/api/profile-picture/delete", {
					method: "POST",
					body: JSON.stringify({ publicId: oldPublicId }),
				});
			}
		} catch (error) {
			console.error("Upload error:", error);
			toast.error("Failed to upload image.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<Button className="mt-6 max-sm:text-xs" size="sm">
				<label htmlFor="file-upload">
					<p
						key="file-upload-span"
						className="relative flex items-center cursor-pointer"
					>
						{isLoading ? (
							<Loader2 size={20} className="animate-spin" />
						) : (
							<>
								<Upload className="h-4 w-4 mr-2" />
								Change Photo
							</>
						)}
					</p>
					<input
						type="file"
						multiple
						accept="image/*"
						name="file-upload"
						id="file-upload"
						className="sr-only"
						disabled={isLoading}
						onChange={handleUpload}
					/>
				</label>
			</Button>
			<p className="text-[10px] leading-5 text-muted-foreground pt-1">
				PNG, JPG, JPEG up to 10MB
			</p>
		</div>
	);
};

export default ProfileImageUpload;
