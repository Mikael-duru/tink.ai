"use server";

import { cookies } from "next/headers";

export const getUserId = async () => {
	const cookieStore = await cookies();
	const userId = cookieStore.get("__session")?.value;

	return userId;
};
