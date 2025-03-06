"use client";

import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

import { generateQuiz, saveQuizResult } from "@/actions/interview";
import useFetch from "@/hooks/use-fetch";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import QuizResult from "./quiz-result";

const Quiz = () => {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState([]);
	const [showExplanation, setShowExplanation] = useState(false);

	const {
		isLoading: generatingQuiz,
		fn: generateQuizFn,
		data: quizData,
	} = useFetch(generateQuiz);

	const {
		isLoading: savingResult,
		fn: saveQuizResultFn,
		data: resultData,
		setData: setResultData,
	} = useFetch(saveQuizResult);

	useEffect(() => {
		if (quizData) {
			setAnswers(new Array(quizData.length).fill(null));
		}
	}, [quizData]);

	const handleAnswer = (answer) => {
		const newAnswers = [...answers];
		newAnswers[currentQuestion] = answer;
		setAnswers(newAnswers);
	};

	const handlePrevious = () => {
		setCurrentQuestion(currentQuestion - 1);
		setShowExplanation(false);
	};

	const lastQuestion = currentQuestion >= quizData?.length - 1;

	const handleNext = () => {
		if (!lastQuestion) {
			setCurrentQuestion(currentQuestion + 1);
			setShowExplanation(false);
		} else {
			submitQuiz();
		}
	};

	const calculateScore = () => {
		let correct = 0;

		answers.forEach((answer, index) => {
			if (answer === quizData[index].correctAnswer) {
				correct++;
			}
		});

		return (correct / quizData.length) * 100;
	};

	const submitQuiz = async () => {
		const score = calculateScore();

		try {
			await saveQuizResultFn(quizData, answers, score);
			toast.success("Quiz completed");
		} catch (error) {
			toast.error(error.message || "Failed to save quiz results.");
		}
	};

	const startNewQuiz = () => {
		setCurrentQuestion(0);
		setAnswers([]);
		setShowExplanation(false);
		setResultData(null);
		generateQuizFn();
	};

	if (generatingQuiz) {
		return <BarLoader className="mt-4" width={"100%"} color="gray" />;
	}

	// Show result if quiz is completed
	if (resultData) {
		return (
			<div className="mx-2">
				<QuizResult result={resultData} onStartNewQuiz={startNewQuiz} />
			</div>
		);
	}

	if (!quizData) {
		return (
			<Card className="mx-2">
				<CardHeader>
					<CardTitle className="leading-[1.2]">
						Ready to test your knowledge?
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						This quiz contains 16 questions specific to your industry and
						skills. Take your time and choose the best answers for each
						question.
					</p>
				</CardContent>
				<CardFooter>
					<Button onClick={generateQuizFn} className="w-full">
						Start Quiz
					</Button>
				</CardFooter>
			</Card>
		);
	}

	const quiz = quizData[currentQuestion];

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Question {currentQuestion + 1} of {quizData.length}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-base sm:text-lg font-medium">{quiz.question}</p>
				<RadioGroup
					onValueChange={handleAnswer}
					value={answers[currentQuestion] || ""}
					className="space-y-2"
				>
					{quiz.options.map((option, index) => {
						return (
							<div className="flex items-center space-x-2" key={index}>
								<RadioGroupItem
									value={option}
									id={`option-${index}`}
									className="shrink-0"
								/>
								<Label htmlFor={`option-${index}`}>{option}</Label>
							</div>
						);
					})}
				</RadioGroup>

				{showExplanation && (
					<div className="mt-4 p-4 bg-muted rounded-lg">
						<p className="font-medium">Explanation:</p>
						<p className="text-muted-foreground">{quiz.explanation}</p>
					</div>
				)}
			</CardContent>
			<CardFooter className="flex flex-col items-start gap-4">
				{!showExplanation && (
					<Button
						onClick={() => setShowExplanation(true)}
						variant="outline"
						disabled={!answers[currentQuestion]}
					>
						Show Explanation
					</Button>
				)}

				<div className="flex items-center justify-between gap-5  w-full">
					{currentQuestion > 0 && (
						<Button
							onClick={handlePrevious}
							disabled={savingResult}
							className="max-sm:text-sm"
							variant="outline"
						>
							<ArrowLeft size={16} /> Back
						</Button>
					)}

					<Button
						onClick={handleNext}
						disabled={!answers[currentQuestion] || savingResult}
						className={`${currentQuestion === 0 ? "ml-auto" : ""}`}
					>
						{savingResult ? (
							<>
								<Loader2 size={20} className="animate-spin" />{" "}
								&nbsp;Submitting...
							</>
						) : !lastQuestion ? (
							"Next Question"
						) : (
							"Finish Quiz"
						)}
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
};

export default Quiz;
