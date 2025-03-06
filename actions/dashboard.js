"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { db } from "@/lib/prisma";
import { getUserId } from "./user";
import { industryInsightPrompt } from "@/lib/utils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
});

export const generateAIInsights = async (industry) => {
	const result = await model.generateContent(industryInsightPrompt(industry));
	const responseText = result.response.text();

	const cleanedResponseText = responseText
		.replace(/```(?:json)?\n?/g, "")
		.trim(); // Remove code blocks, trailing newlines, and spaces around it

	return JSON.parse(cleanedResponseText);
};

export const getIndustryInsights = async () => {
	try {
		const userId = await getUserId();
		if (!userId) throw new Error("Unauthorized");

		const user = await db.user.findUnique({
			where: { firebaseUserId: userId },
			include: {
				industryInsight: true,
			},
		});
		if (!user) throw new Error("User not found");

		if (!user.industryInsight) {
			const insights = await generateAIInsights(user.industry);

			const industryInsight = await db.industryInsight.create({
				data: {
					industry: user.industry,
					...insights,
					nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				},
			});

			return industryInsight;
		}

		return user.industryInsight;
	} catch (error) {
		console.error("Error fetching industry insights:", error.message);
		throw new Error("Failed to fetch industry insights: " + error.message);
	}
};
