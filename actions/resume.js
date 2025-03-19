"use server";

import { db } from "@/lib/prisma";
import { getUserId } from "./user";

import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
	atsScorePrompt,
	improveSummaryPrompt,
	improveWithAIPrompt,
} from "@/lib/utils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
});

export const saveResume = async ({ resumeContent, atsScore, feedback }) => {
	const userId = await getUserId();
	if (!userId) throw new Error("Unauthorized");

	const user = await db.user.findUnique({ where: { firebaseUserId: userId } });
	if (!user) throw new Error("User not found");

	const resume = await db.resume.upsert({
		where: { userId: user.id },
		update: { content: resumeContent, atsScore, feedback },
		create: { userId: user.id, content: resumeContent, atsScore, feedback },
	});

	revalidatePath("/resume");
	return resume;
};

export const getResume = async () => {
	const userId = await getUserId();
	if (!userId) throw new Error("Unauthorized");

	const user = await db.user.findUnique({
		where: { firebaseUserId: userId },
	});
	if (!user) throw new Error("User not found");

	return await db.resume.findUnique({
		where: {
			userId: user.id,
		},
	});
};

export const improveWithAI = async ({ type, title, current }) => {
	try {
		const userId = await getUserId();
		if (!userId) throw new Error("Unauthorized");

		const user = await db.user.findUnique({
			where: { firebaseUserId: userId },
			select: { industry: true },
		});
		if (!user) throw new Error("User not found");

		const prompt =
			type === "summary"
				? improveSummaryPrompt({ userIndustry: user.industry, current })
				: improveWithAIPrompt({
						type,
						userIndustry: user.industry,
						title,
						current,
				  });

		const result = await model.generateContent(prompt);

		return result.response.text().trim();
	} catch (error) {
		console.error("Error improving resume content:", error.message);
		throw new Error("Failed to improve resume content");
	}
};

export const getAtsScoreAndFeedback = async ({ current }) => {
	try {
		const userId = await getUserId();
		if (!userId) throw new Error("Unauthorized");

		const user = await db.user.findUnique({
			where: { firebaseUserId: userId },
			select: { industry: true },
		});
		if (!user) throw new Error("User not found");

		const result = await model.generateContent(
			atsScorePrompt({ resumeContent: current })
		);
		const responseText = result.response.text().trim();
		const cleanedResponseText = responseText
			.replace(/```(?:json)?\n?/g, "")
			.trim();

		const atsScoreAndFeedback = JSON.parse(cleanedResponseText);

		return atsScoreAndFeedback;
	} catch (error) {
		console.error("Error fetching ATS score:", error.message);
		throw new Error("Failed to fetch ATS score");
	}
};
