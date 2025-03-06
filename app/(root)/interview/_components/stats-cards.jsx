import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy } from "lucide-react";
import React from "react";

const StatsCards = ({ assessments }) => {
	const getAverageScore = () => {
		if (!assessments?.length) return 0;

		const total = assessments.reduce(
			// Sum is accumulator, which by default is 0 (zero).
			(sum, assessment) => sum + assessment?.quizScore,
			0
		);

		return (total / assessments?.length).toFixed(1);
	};

	const getLatestAssessment = () => {
		if (!assessments.length) return null;

		return assessments[0];
	};

	const getTotalQuestions = () => {
		if (!assessments?.length) return 0;

		return assessments.reduce(
			(sum, assessment) => sum + assessment?.questions.length,
			0
		);
	};

	return (
		<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
			{/* Average score across all assessments */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Average Score</CardTitle>
					<Brain className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<h2 className="text-2xl font-bold">{getAverageScore()}%</h2>
					<p className="text-muted-foreground text-xs">
						Across all assessments
					</p>
				</CardContent>
			</Card>

			{/* Questions practised */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Questions Practised
					</CardTitle>
					<Trophy className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<h2 className="text-2xl font-bold">{getTotalQuestions()}</h2>
					<p className="text-muted-foreground text-xs">Total questions</p>
				</CardContent>
			</Card>

			{/* Latest score */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Latest Score</CardTitle>
					<Trophy className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<h2 className="text-2xl font-bold">
						{getLatestAssessment()?.quizScore.toFixed(1) || 0}%
					</h2>
					<p className="text-muted-foreground text-xs">Most recent quiz</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default StatsCards;
