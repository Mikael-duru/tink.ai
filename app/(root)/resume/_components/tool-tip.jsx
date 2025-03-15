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
			text: "Include your target job title, experience, achievements, and what makes you stand out—avoid vague phrases and end each line with a full stop",
		},
		Skills: {
			text: "List all your technical and soft skills in a single line, separated by commas.",
		},
		Experience: {
			text: "Include key achievements, tools you used, and measurable impact. Focus on what you accomplished, not just what you did.",
		},
		Project: {
			text: "Describe your project's goal, technologies used, key features, and measurable impact—End each line with a full stop and avoid vague descriptions.",
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
