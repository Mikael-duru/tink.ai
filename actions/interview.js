"use server";

import { db } from "@/lib/prisma";
import { getUserId } from "./user";
import { improvementPrompt, quizPrompt } from "@/lib/utils";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
});

export const generateQuiz = async () => {
	try {
		const userId = await getUserId();
		if (!userId) throw new Error("Unauthorized");

		const user = await db.user.findUnique({
			where: { firebaseUserId: userId },
		});
		if (!user) throw new Error("User not found");

		const result = await model.generateContent(quizPrompt(user));
		const responseText = result.response.text();

		const cleanedResponseText = responseText
			.replace(/```(?:json)?\n?/g, "")
			.trim();

		const quiz = JSON.parse(cleanedResponseText);

		return quiz.questions;
	} catch (error) {
		console.error("Error generating quiz:", error.message);
		throw new Error("Failed to generate quiz: " + error.message);
	}
};

export const saveQuizResult = async (questions, answers, score) => {
	try {
		const userId = await getUserId();
		if (!userId) throw new Error("Unauthorized");

		const user = await db.user.findUnique({
			where: { firebaseUserId: userId },
		});
		if (!user) throw new Error("User not found");

		const questionResults = questions.map((q, index) => ({
			question: q.question,
			answer: q.correctAnswer,
			userAnswer: answers[index],
			isCorrect: q.correctAnswer === answers[index],
			explanation: q.explanation,
		}));

		const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
		let improvementTip = null;

		if (wrongAnswers.length > 0) {
			const wrongQuestionsText = wrongAnswers
				.map(
					(q) =>
						`Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
				)
				.join("\n\n");

			const result = await model.generateContent(
				improvementPrompt({ userIndustry: user.industry, wrongQuestionsText })
			);
			improvementTip = result.response.text().trim();
		}

		const assessment = await db.assessment.create({
			data: {
				userId: user.id, // Neon db generated user id
				quizScore: score,
				questions: questionResults,
				category: "Technical",
				improvementTip,
			},
		});

		return assessment;
	} catch (error) {
		console.error("Error saving quiz result:", error.message);
		throw new Error("Failed to save quiz result: " + error.message);
	}
};

export const getAssessments = async () => {
	const userId = await getUserId();
	if (!userId) throw new Error("Unauthorized");

	const user = await db.user.findUnique({
		where: { firebaseUserId: userId },
	});
	if (!user) throw new Error("User not found");

	try {
		const assessments = await db.assessment.findMany({
			where: { userId: user.id },
			orderBy: { createdAt: "desc" },
		});

		return assessments;
	} catch (error) {
		console.error("Error fetching assessments:", error.message);
		throw new Error("Failed to fetch assessments: " + error.message);
	}
};
