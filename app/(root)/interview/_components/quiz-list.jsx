"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";

const QuizList = ({ assessments }) => {
	const router = useRouter();
	const [selectedQuiz, setSelectedQuiz] = useState(null);

	return (
		<>
			<Card>
				<CardHeader className="sm:flex sm:flex-row sm:items-center justify-between gap-5">
					<div>
						<CardTitle className="gradient-title text-3xl sm:text-4xl">
							Recent Quizzes
						</CardTitle>
						<CardDescription>Review your past quiz performance</CardDescription>
					</div>
					<Button onClick={() => router.push("/interview/mock")}>
						Start New Quiz
					</Button>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{assessments.map((assessment, index) => {
							return (
								<Card
									key={assessment.id}
									className={`cursor-pointer hover:bg-muted/50 transition-colors ${
										selectedQuiz === assessment ? "bg-muted" : ""
									}`}
									onClick={() => setSelectedQuiz(assessment)}
								>
									<CardHeader>
										<CardTitle>Quiz {index + 1}</CardTitle>
										<CardDescription className="flex gap-5 justify-between w-full">
											<p>Score: {assessment.quizScore.toFixed(1)}%</p>
											<p>
												{format(
													new Date(assessment.createdAt),
													"MMM dd, yyy HH:mm"
												)}
											</p>
										</CardDescription>
									</CardHeader>
									<CardContent>
										{assessment.improvementTip ? (
											<p className="text-sm text-muted-foreground">
												<span className="font-bold">Improvement Tip:</span>{" "}
												{assessment.improvementTip}
											</p>
										) : (
											<p className="text-sm text-muted-foreground">
												<span className="text-lg">🎉</span> Congratulations! You
												nailed the interview quiz!
											</p>
										)}
									</CardContent>
								</Card>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* result's dialog */}
			<Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
				<DialogContent className="max-lg:w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto max-sm:p-4">
					<DialogHeader>
						<DialogTitle></DialogTitle>
					</DialogHeader>

					<QuizResult
						result={selectedQuiz}
						onStartNewQuiz={() => router.push("/interview/mock")}
						hideStartNewQuiz
					/>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default QuizList;
