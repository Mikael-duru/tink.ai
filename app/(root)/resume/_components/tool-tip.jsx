import { Info } from "lucide-react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const ToolTip = ({ type }) => {
	const toolTipText = {
		Summary: {
			text: "Include your target job title, years of experience, achievements, and what makes you stand out—avoid vague phrases.",
		},
		Skills: {
			text: "List all your technical and soft skills in a single line, separated by commas.",
		},
		Experience: {
			text: "Include key achievements, tools you used, and measurable impact. Focus on what you accomplished, not just what you did. Start each point on a new line (use 'enter' key) and avoid vague descriptions.",
		},
		Project: {
			text: "Describe your project's goal, technologies used, key features, and measurable impact—Start each point on a new line (use 'enter' key) and avoid vague descriptions.",
		},
	};
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger onClick={(e) => e.preventDefault()}>
					<Info className="text-muted-foreground size-5" />
				</TooltipTrigger>
				<TooltipContent>
					<p>{toolTipText[type].text}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default ToolTip;
