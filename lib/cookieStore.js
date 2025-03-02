"use server";

import { cookies } from "next/headers";

export const storeUser = async ({ idToken }) => {
	const cookieStore = await cookies();
	const expiresIn = 60 * 60 * 24 * 5;

	try {
		cookieStore.set("__session", idToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // Use secure cookies in production
			path: "/",
			maxAge: expiresIn, // 5days
		});
	} catch (error) {
		console.log("Saving_cookies:", error);
	}
};

export const deleteStoredUser = async () => {
	const cookieStore = await cookies();

	try {
		cookieStore.delete("__session");
	} catch (error) {
		console.log("Saving_cookies:", error);
	}
};
