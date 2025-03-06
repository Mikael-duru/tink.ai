import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { CheckCircle2, Trophy, XCircle } from "lucide-react";

const QuizResult = ({ result, hideStartNewQuiz = false, onStartNewQuiz }) => {
	if (!result) return null;

	return (
		<div>
			<h1 className="flex items-center gap-2 text-3xl gradient-title">
				<Trophy className="size-6 text-yellow-500" /> Quiz Results
			</h1>

			<CardContent className="space-y-6">
				{/* Score Overview */}
				<div className="text-center space-y-2">
					<h3 className="text-2xl font-bold">
						{result?.quizScore.toFixed(1)}%
					</h3>
					<Progress value={result?.quizScore} className="w-full" />
				</div>

				{/* Improvement Tip */}
				{result?.improvementTip && (
					<div className="bg-muted p-4 rounded-lg">
						<h3 className="font-medium">Improvement Tip:</h3>
						<p className="text-muted-foreground">{result?.improvementTip}</p>
					</div>
				)}

				<div className="space-y-4">
					<h3 className="font-medium">Questions Review</h3>
					{result?.questions.map((q, i) => (
						<div key={i} className="border rounded-lg p-4 space-y-2">
							<div className="flex items-start justify-between gap-2">
								<p className="font-medium">{q.question}</p>
								{q.isCorrect ? (
									<CheckCircle2 className="size-5 text-green-500 shrink-0" />
								) : (
									<XCircle className="size-5 text-red-500 shrink-0" />
								)}
							</div>

							<div className="text-sm text-muted-foreground">
								<p>Your answer: {q.userAnswer}</p>
								{!q.isCorrect && <p>Correct answer: {q.answer}</p>}
							</div>

							<div className="text-sm text-muted-foreground">
								<p className="font-medium">Explanation:</p>
								<p>{q.explanation}</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>

			{!hideStartNewQuiz && (
				<CardFooter>
					<Button className="w-full" onClick={onStartNewQuiz}>
						Start New Quiz
					</Button>
				</CardFooter>
			)}
		</div>
	);
};

export default QuizResult;
