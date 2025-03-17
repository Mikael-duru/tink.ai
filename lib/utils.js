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
	return `Generate 16 technical interview questions for a ${
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

export const improveSummaryPrompt = ({ userIndustry, current }) => {
	return `Carefully analyze and enhance the following professional summary for a ${userIndustry} professional to ensure it meets **more compelling, ATS-friendly, and aligned with industry standards**:

	**Current Summary:** "${current}"

	**Requirements:**
	- **Use strong action verbs** to showcase expertise and leadership.
	- **Incorporate quantifiable achievements** and measurable outcomes where possible.
	- **Highlight key skills and industry knowledge** relevant to the role.
	- **Keep it concise yet impactful**, ideally within 2-3 sentences.
	- **Make it engaging and forward-looking**, reflecting career growth, career objectives, and expertise.
	- **Integrate industry-specific keywords** for better alignment with hiring expectations.

	**Response format:**  
	Return ONLY the **revised professional summary** as a **single, well-structured paragraph** with NO additional text, notes, or formatting.`;
};

export const improveWithAIPrompt = ({ type, userIndustry, current }) => {
	return `Enhance the following ${type} description for a ${userIndustry} professional, making it **more impactful, results-driven, ATS-friendly, and aligned with industry standards**.

	Current content: "${current}"

	**Requirements:**
	- **Use strong action verbs** to highlight expertise and contributions.
	- **Incorporate quantifiable metrics** and measurable outcomes where applicable.
	- **Emphasize relevant technical skills** to showcase industry proficiency.
	- **Keep it concise yet detailed (ideally within 1-5 sentences)**, avoiding unnecessary filler.
	- **Highlight achievements rather than listing responsibilities**.
	- **Integrate industry-specific keywords** to improve relevance.

	**Response format:**  
	Return the improved description as a **single, polished paragraph** without any additional text, explanations, or formatting.`;
};

export const atsScorePrompt = ({ resumeContent }) => {
	return `Evaluate the **ATS compatibility** of the following resume content as object and provide:  

	1. **An ATS score from 1 to 100** based on keyword optimization, structure, readability, and alignment with industry standards.  
	2. **A concise 1-4 sentence feedback** highlighting key improvements (e.g., missing keywords, formatting issues, or areas for better clarity).  

	Resume Content:  
	${JSON.stringify(resumeContent, null, 2)}  

	**Response Format (JSON only, no extra text):**  
	{
	  "atsScore": number,
	  "feedback": "string"
	}
		
	STRICT REQUIREMENTS:
	- Return ONLY the JSON object.
	- Do NOT include any markdown formatting, explanations, or additional text.
	- atsScore must be a percentage.
	- Maintain correct JSON syntax to ensure it is parseable.`;
};

export const coverLetterPrompt = ({ user, data }) => {
	return `Generate a **tailored, ATS-friendly cover letter** for a **${
		data.jobTitle
	}** position at **${data.companyName}**.  

	### **Candidate Details:**  
	- **Years of Experience:** ${user.experience}  
	- **Key Skills:** ${user.skills?.join(", ")}  
	- **Professional Background:** ${user.bio}  

	### **Job Description:**  
	${data.jobDescription}  

	### **Cover Letter Requirements:**  
	1. Use a **professional, engaging, and confident tone** that aligns with the job role.  
	2. **Personalize it** by addressing the hiring manager (if available).  
	3. Focus on **relevant skills and expertise** from the job description—**avoid mentioning achievements.**  
	4. Show **genuine enthusiasm for the company** and an **understanding of its needs**.  
	5. Demonstrate understanding of the company's mission, values, or projects (if unknown, infer a relevant theme from the job description).
	6. Remove all placeholders—ensure the content flows naturally as a complete email letter.
	7. Keep it **concise (max 400 words)** while making a strong impact.  
	8. **Use proper business letter formatting** (salutation, introduction, body, and closing).  
	9. **End with a strong closing paragraph and CTA**, including a **resume attachment reference**.  
	10. **Avoid generic statements**—make it **specific and compelling**.  

	### **Response Format:**  
	Return the **finalized cover letter** as properly formatted <p style="margin-bottom: 1rem;"></p> tag, ensuring professional structure and readability. Do not include any additional explanations or notes.`;
};
