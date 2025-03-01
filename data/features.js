import { BrainCircuit, Briefcase, LineChart, ScrollText } from "lucide-react";

export const features = [
	{
		icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
		title: "AI-Powered Career Coaching",
		description:
			"Leverage AI-driven insights to navigate your career path with confidence.",
	},
	{
		icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
		title: "Smart Resume Builder",
		description:
			"Create polished, ATS-friendly resumes that get noticed by recruiters.",
	},
	{
		icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
		title: "Mock Interview Simulator",
		description:
			"Practice real-world interview scenarios with AI-generated feedback and tips.",
	},
	{
		icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
		title: "Data-Driven Job Insights",
		description:
			"Analyze market trends, salary benchmarks, and in-demand skills to stay competitive.",
	},
];
