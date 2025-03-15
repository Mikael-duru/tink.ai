import { z } from "zod";

export const onboardingSchema = z.object({
	industry: z.string({
		required_error: "Please select an industry",
	}),
	subIndustry: z.string({
		required_error: "Please select a specialization",
	}),
	bio: z.string().max(500).optional(),
	experience: z
		.string()
		.transform((val) => parseInt(val, 10))
		.pipe(
			z
				.number()
				.min(0, "Experience must be at least 0 years")
				.max(50, "Experience cannot exceed 50 years")
		),
	skills: z.string().transform((val) =>
		val
			? val
					.split(",")
					.map((skill) => skill.trim())
					.filter(Boolean)
			: undefined
	),
});

export const resumeContactSchema = z.object({
	fullName: z.string().min(1, "Full name is required"),
	jobTitle: z.string().min(1, "Job title is required"),
	location: z.string().min(1, "Location (City, State) is required"),
	phoneNumber: z.string().min(1, "Phone number is required"),
	email: z.string().email(),
	linkedIn: z.string().optional(),
});

export const resumeEntrySchema = (type) =>
	z
		.object({
			title: z.string().min(1, "Title is required"),
			organization:
				type === "Project"
					? z.string().optional()
					: z.string().min(1, "Organization is required"),
			projectURL:
				type !== "Project"
					? z.string().optional()
					: z.string().url().min(1, "Live demo url is required"),
			startDate:
				type === "Project"
					? z.string().optional()
					: z.string().min(1, "Start date is required"),
			endDate: z.string().optional(),
			description:
				type === "Education"
					? z.string().optional()
					: z.string().min(1, "Description is required"),
			current: z.boolean().default(false),
		})
		.refine(
			(data) => {
				if (
					["Experience", "Education"].includes(type) &&
					!data.current &&
					!data.endDate
				) {
					return false;
				}
				return true;
			},
			{
				message: "End date is required, unless this is your current position.",
				path: ["endDate"],
			}
		);

export const resumeSchema = z.object({
	contactInfo: resumeContactSchema,
	summary: z.string().min(1, "Professional summary is required"),
	skills: z.string().min(1, "Skills are required"),
	experience: z.array(resumeEntrySchema("Experience")),
	projects: z.array(resumeEntrySchema("Project")),
	education: z.array(resumeEntrySchema("Education")),
});
