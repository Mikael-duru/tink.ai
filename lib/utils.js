import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const industryInsightPrompt = ({ industry }) => {
	return `Provide a detailed analysis of the ${industry} industry, ensuring the response is structured in EXACTLY the following JSON format with NO additional text, notes, or explanations:

	{
		"salaryRanges": [
			{ "role": "string", "min": number, "max": number, "median": number, "location": "string" },
			{ "role": "string", "min": number, "max": number, "median": number, "location": "string" },
			{ "role": "string", "min": number, "max": number, "median": number, "location": "string" },
			{ "role": "string", "min": number, "max": number, "median": number, "location": "string" },
			{ "role": "string", "min": number, "max": number, "median": number, "location": "string" }
		], // Include at least 5 common roles for salary ranges
		"growthRate": number, // Industry growth rate as a percentage
		"demandLevel": "HIGH" | "MEDIUM" | "LOW", // Indicate the current demand level
		"topSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"], // List at least 5 top skills
		"marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE", // General industry outlook
		"keyTrends": ["trend1", "trend2", "trend3", "trend4", "trend5"], // Include at least 5 key industry trends
		"recommendedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"] // At least 5 recommended skills for success
	}

	STRICT REQUIREMENTS:
	- Return ONLY the JSON object.
	- Do NOT include any markdown formatting, explanations, or additional text.
	- The JSON should contain at least 5 salary roles with salary ranges.
	- Growth rate must be a percentage.
	- Include at least 5 top skills and trends.
	- Maintain correct JSON syntax to ensure it is parseable.`;
};

export const quizPrompt = ({ user }) => {
	return `Generate 3 technical interview questions for a ${
		user?.industry
	} professional${
		user?.skills?.length ? ` with expertise in ${user?.skills.join(", ")}` : ""
	}.
    
    Each question should be multiple choice with 4 options.

    The explanation should be in layman's terms and provide context for the question, but it should NOT indicate the correct answer, suggest a preference, or hint at which option is correct. It should remain neutral.

    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }`;
};

export const improvementPrompt = ({ userIndustry, wrongQuestionsText }) => {
	return `The user answered the following ${userIndustry} technical interview questions incorrectly:

	${wrongQuestionsText}

	Analyze the mistakes and provide a **concise and encouraging improvement tip** in layman's terms. 

	**Guidelines for response:**
	- Focus on the **knowledge gaps** revealed by the incorrect answers.
	- Offer **practical advice** on what the user should learn or practice.
	- **DO NOT** explicitly mention the mistakes or correct answers.
	- Keep the response **under two sentences**.
	- Ensure the response is **motivational and constructive**.`;
};
