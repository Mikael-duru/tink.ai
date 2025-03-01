import { UserPlus, FileEdit, Users, LineChart } from "lucide-react";

export const howItWorks = [
	{
		title: "Seamless Onboarding",
		description:
			"Tell us about your industry and expertise to receive tailored career insights.",
		icon: <UserPlus className="w-8 h-8 text-primary" />,
	},
	{
		title: "Build Winning Documents",
		description:
			"Generate ATS-friendly resumes and impactful cover letters effortlessly.",
		icon: <FileEdit className="w-8 h-8 text-primary" />,
	},
	{
		title: "Ace Your Interviews",
		description:
			"Practice with AI-driven mock interviews customized for your desired role.",
		icon: <Users className="w-8 h-8 text-primary" />,
	},
	{
		title: "Track & Improve",
		description:
			"Gain insights into your progress with real-time performance analytics.",
		icon: <LineChart className="w-8 h-8 text-primary" />,
	},
];
