"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { db } from "@/lib/prisma";
import { getUserId } from "./user";
import { coverLetterPrompt } from "@/lib/utils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
});

export const generateCoverLetter = async (data) => {
	try {
		const userId = await getUserId();
		if (!userId) throw new Error("Unauthorized");

		const user = await db.user.findUnique({
			where: { firebaseUserId: userId },
		});

		if (!user) throw new Error("User not found");

		const result = await model.generateContent(
			coverLetterPrompt({ user, data })
		);

		const responseText = result.response.text().trim();

		const coverLetter = await db.coverLetter.create({
			data: {
				userId: user.id,
				content: responseText,
				companyName: data.companyName,
				jobTitle: data.jobTitle,
				jobDescription: data.jobDescription,
			},
		});

		return coverLetter;
	} catch (error) {
		console.error("Error generating cover letter:", error.message);
		throw new Error("Failed to generate cover letter");
	}
};

export const getAllCoverLetter = async () => {
	try {
		const userId = await getUserId();
		if (!userId) throw new Error("Unauthorized");

		const user = await db.user.findUnique({
			where: { firebaseUserId: userId },
		});

		if (!user) throw new Error("User not found");

		const coverLetters = await db.coverLetter.findMany({
			where: { userId: user.id },
			orderBy: {
				createdAt: "desc",
			},
		});

		return coverLetters;
	} catch (error) {
		console.error("Error fetching cover letters:", error.message);
		throw new Error("Failed to fetch cover letters");
	}
};

export const getCoverLetterById = async (id) => {
	try {
		const userId = await getUserId();
		if (!userId) throw new Error("Unauthorized");

		const user = await db.user.findUnique({
			where: { firebaseUserId: userId },
		});

		if (!user) throw new Error("User not found");

		return await db.coverLetter.findUnique({
			where: { id, userId: user.id },
		});
	} catch (error) {
		console.error("Error fetching cover letters:", error.message);
		throw new Error("Failed to fetch cover letters");
	}
};

export const deleteCoverLetterById = async (id) => {
	try {
		const userId = await getUserId();
		if (!userId) throw new Error("Unauthorized");

		const user = await db.user.findUnique({
			where: { firebaseUserId: userId },
		});

		if (!user) throw new Error("User not found");

		return await db.coverLetter.delete({
			where: { id, userId: user.id },
		});
	} catch (error) {
		console.error("Error fetching cover letters:", error.message);
		throw new Error("Failed to fetch cover letters");
	}
};
