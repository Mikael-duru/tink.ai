import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const prompt = ({ industry }) => {
	return `Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
					{
						"salaryRanges": [
							{ "role": "string", "min": number, "max": number, "median": number, "location": "string" }
						],
						"growthRate": number,
						"demandLevel": "HIGH" | "MEDIUM" | "LOW",
						"topSkills": ["skill1", "skill2"],
						"marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
						"keyTrends": ["trend1", "trend2"],
						"recommendedSkills": ["skill1", "skill2"]
					}
					
					IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
					Include at least 5 common roles for salary ranges.
					Growth rate should be a percentage.
					Include at least 5 skills and trends.`;
};
