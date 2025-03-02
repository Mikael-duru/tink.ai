import { cookies } from "next/headers";

import admin from "./firebaseAdmin";
import { db } from "./prisma";

export const checkUser = async () => {
	const cookieStore = await cookies();
	const userId = cookieStore.get("__session")?.value;

	try {
		if (!userId) return null;

		// Fetch user details from Firestore
		const userDoc = await admin
			.firestore()
			.collection("users")
			.doc(userId)
			.get();
		if (!userDoc.exists) {
			throw new Error("User details not found in Firestore");
		}

		const userData = userDoc.data();

		// Check or create user in Prisma database
		let loggedInUser = await db.user.findUnique({
			where: { firebaseUserId: userId },
		});

		if (!loggedInUser) {
			loggedInUser = await db.user.create({
				data: {
					name:
						userData.displayName ||
						`${userData.firstname} ${userData.lastname}`,
					firebaseUserId: userId,
					imageUrl: userData.photoURL || "",
					email: userData.email,
				},
			});
		}

		return loggedInUser;
	} catch (error) {
		console.error("Error in checkUser:", error.message);
		return null;
	}
};
