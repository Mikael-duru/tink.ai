"use server";

import { cookies } from "next/headers";

import { db } from "@/lib/prisma";
import { generateAIInsights } from "./dashboard";

export const getUserId = async () => {
	const cookieStore = await cookies();
	const userId = cookieStore.get("__session")?.value;

	return userId;
};

export const updateUser = async (data) => {
	const userId = await getUserId();

	if (!userId) throw new Error("Unauthorized");

	const user = await db.user.findUnique({
		where: {
			firebaseUserId: userId,
		},
	});

	if (!user) throw new Error("User not found");

	try {
		const result = await db.$transaction(
			async (tx) => {
				// Check if the industry exists
				let industryInsight = await tx.industryInsight.findUnique({
					where: {
						industry: data.industry,
					},
				});

				// If industryInsight doesn't exist, create a new one with data.industry using Gemini-1.5-fresh AI.
				if (!industryInsight) {
					const insights = await generateAIInsights(data.industry);

					industryInsight = await db.industryInsight.create({
						data: {
							industry: data.industry,
							...insights,
							nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
						},
					});
				}

				// Update the user
				const updatedUser = await tx.user.update({
					where: {
						firebaseUserId: userId,
					},
					data: {
						industry: data.industry,
						experience: data.experience,
						skills: data.skills,
						bio: data.bio,
					},
				});

				return { updatedUser, industryInsight };
			},
			{
				timeout: 10000, // default is 5000
			}
		);

		return { success: true, ...result };
	} catch (error) {
		console.error("Error updating user and industry:", error.message);
		throw new Error("Failed to update profile " + error.message);
	}
};

export const getUserOnboardingStatus = async () => {
	const userId = await getUserId();

	if (!userId) throw new Error("Unauthorized");

	const user = await db.user.findUnique({
		where: {
			firebaseUserId: userId,
		},
	});

	if (!user) throw new Error("User not found");

	try {
		const user = await db.user.findUnique({
			where: {
				firebaseUserId: userId,
			},
			select: {
				industry: true,
			},
		});

		return {
			isOnboarded: !!user?.industry, // !! operator is a way to convert a value to a boolean (it returns true for truthy values and false for falsy values).
		};
	} catch (error) {
		console.error("Error checking onboarding status:", error.message);
		throw new Error("Failed to check onboarding status");
	}
};
