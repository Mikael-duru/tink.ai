"use server";

import { getUserId } from "@/lib/getUserId";
import { db } from "@/lib/prisma";

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
				let industryInsights = await tx.industryInsight.findUnique({
					where: {
						industry: data.industry,
					},
				});

				// If industry doesn't exist, create a new one with data.industry and default values.
				if (!industryInsights) {
					industryInsights = await tx.industryInsight.create({
						data: {
							industry: data.industry,
							salaryRanges: [],
							growthRate: 0,
							demandLevel: "MEDIUM",
							topSkills: [],
							marketOutlook: "NEUTRAL",
							keyTrends: [],
							recommendedSkills: [],
							nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
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

				return { updatedUser, industryInsights };
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
