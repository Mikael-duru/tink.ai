"use client";

import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Loader2, Save, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
	getAtsScoreAndFeedback,
	improveWithAI,
	saveResume,
} from "@/actions/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import EntryForm from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { resumeSchema } from "@/lib/schema";
import ToolTip from "./tool-tip";
import ResumeDisplay from "./resume-display";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

const ResumeBuilder = ({
	initialContent,
	initialAtsScore,
	initialFeedback,
}) => {
	const [activeTab, setActiveTab] = useState("edit");
	const [atsScore, setAtsScore] = useState(initialAtsScore);
	const [feedback, setFeedback] = useState(initialFeedback);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	// Initialize form with initialContent if available
	const {
		control,
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(resumeSchema),
		defaultValues: initialContent || {
			contactInfo: {},
			summary: "",
			skills: "",
			experience: [],
			projects: [],
			education: [],
		},
	});

	// Initialize form with saved data when component mounts
	useEffect(() => {
		if (initialContent) {
			reset(initialContent);
			setActiveTab("preview");
		}
	}, [initialContent, reset]);

	const {
		isLoading: isSaving,
		fn: saveResumeFn,
		data: saveResult,
		error: saveError,
	} = useFetch(saveResume);

	const {
		isLoading: isGeneratingAtsScoreAndFeedback,
		fn: getAtsScoreAndFeedbackFn,
		data: atsScoreAndFeedbackContent,
		error: atsScoreAndFeedbackError,
	} = useFetch(getAtsScoreAndFeedback);

	const {
		isLoading: isImprovingSummary,
		fn: improveWithAIFn,
		data: improveSummaryContent,
		error: improveSummaryError,
	} = useFetch(improveWithAI);

	useEffect(() => {
		if (!isImprovingSummary && improveSummaryContent) {
			setValue("summary", improveSummaryContent);
			toast.success("Summary improved successfully!");
		}
	}, [
		improveSummaryContent,
		isImprovingSummary,
		improveSummaryError,
		setValue,
	]);

	const handleImproveSummaryWithAI = async () => {
		const summaryText = watch("summary");
		if (!summaryText) {
			toast.error("Please write a professional summary!");
			return;
		}

		await improveWithAIFn({
			current: summaryText,
			type: "summary",
		});
	};

	const formValues = watch();

	useEffect(() => {
		if (saveResult && !isSaving) {
			toast.success("Resume saved successfully!");
		}
		if (saveError) {
			toast.error("Failed to save resume!");
		}
	}, [saveResult, isSaving, saveError]);

	const onSubmit = async (data) => {
		try {
			await saveResumeFn({
				resumeContent: data,
				atsScore,
				feedback,
			});
		} catch (error) {
			console.error("Error saving resume:", error.message || error);
		}
	};

	const handleGenerateAtsScore = async () => {
		try {
			await getAtsScoreAndFeedbackFn({ current: formValues });

			if (atsScoreAndFeedbackContent && !atsScoreAndFeedbackError) {
				setIsSheetOpen(true);
				setAtsScore(atsScoreAndFeedbackContent?.atsScore);
				setFeedback(atsScoreAndFeedbackContent?.feedback);
			}
		} catch (error) {
			console.error("Error fetching ATS score:", error.message || error);
			toast.error("Failed to fetch ATS score.");
		}
	};

	const generatePDF = async () => {
		setIsGenerating(true);
		try {
			const element = document.getElementById("resume-pdf");

			const opt = {
				margin: [0.5, 0.5],
				filename: "resume.pdf",
				image: { type: "jpeg", quality: 0.98 },
				html2canvas: { scale: 2 },
				jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
			};

			await html2pdf().from(element).set(opt).save();
		} catch (error) {
			console.error("Error generating PDF:", error);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex max-sm:flex-col justify-between sm:items-center gap-2">
				<h1 className="font-bold gradient-title text-5xl md:text-6xl">
					Resume Builder
				</h1>

				<div className="space-x-2">
					<Button
						className="bg-green-600 text-white hover:bg-green-700"
						onClick={handleSubmit(onSubmit)}
						disabled={isSaving || activeTab !== "preview"}
					>
						{isSaving ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
								<span className="sm:hidden lg:block">Saving...</span>
							</>
						) : (
							<>
								<Save className="h-4 w-4" /> Save
							</>
						)}
					</Button>
					<Button
						onClick={generatePDF}
						disabled={isGenerating || activeTab !== "preview"}
					>
						{isGenerating ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />{" "}
								<span className="sm:hidden lg:block">Generating PDF...</span>
							</>
						) : (
							<>
								<Download size={16} />{" "}
								<span className="sm:hidden lg:block">Download PDF</span>
							</>
						)}
					</Button>
				</div>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="mb-8">
					<TabsTrigger value="edit">Form</TabsTrigger>
					<TabsTrigger value="preview">Preview</TabsTrigger>
				</TabsList>
				<TabsContent value="edit">
					<form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
						{/* Contact Info */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Contact Information</h3>
							<div className="p-4 border rounded-lg bg-muted/50">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									{/* Full Name */}
									<div className="space-y-2 ">
										<Label className="text-sm font-medium">Full Name</Label>
										<Input
											{...register("contactInfo.fullName")}
											type="text"
											placeholder="Enter your full name"
											error={errors.contactInfo?.fullName}
										/>

										{errors.contactInfo?.fullName && (
											<p className="text-sm text-red-500">
												{errors.contactInfo.fullName.message}
											</p>
										)}
									</div>

									{/* Job Title */}
									<div className="space-y-2">
										<Label className="text-sm font-medium">Job Title</Label>
										<Input
											{...register("contactInfo.jobTitle")}
											type="text"
											placeholder="e.g. Frontend Developer, UI/UX Designer"
											error={errors.contactInfo?.jobTitle}
										/>

										{errors.contactInfo?.jobTitle && (
											<p className="text-sm text-red-500">
												{errors.contactInfo?.jobTitle.message}
											</p>
										)}
									</div>

									{/* Location */}
									<div className="space-y-2">
										<Label className="text-sm font-medium">Location</Label>
										<Input
											{...register("contactInfo.location")}
											type="text"
											placeholder="e.g. Lagos, Nigeria"
											error={errors.contactInfo?.location}
										/>

										{errors.contactInfo?.location && (
											<p className="text-sm text-red-500">
												{errors.contactInfo.location.message}
											</p>
										)}
									</div>

									{/* Phone Number */}
									<div className="space-y-2">
										<Label className="text-sm font-medium">Phone Number</Label>
										<Input
											{...register("contactInfo.phoneNumber")}
											type="tel"
											placeholder="(+234) 9080900080"
											error={errors.contactInfo?.phoneNumber}
										/>

										{errors.contactInfo?.phoneNumber && (
											<p className="text-sm text-red-500">
												{errors.contactInfo?.phoneNumber.message}
											</p>
										)}
									</div>

									{/* Email */}
									<div className="space-y-2">
										<Label className="text-sm font-medium">Email</Label>
										<Input
											{...register("contactInfo.email")}
											type="email"
											placeholder="your@email.com"
										/>

										{errors.contactInfo?.email && (
											<p className="text-sm text-red-500">
												{errors.contactInfo.email.message}
											</p>
										)}
									</div>

									{/* LinkedIn */}
									<div className="space-y-2">
										<Label className="text-sm font-medium">
											LinkedIn URL (optional)
										</Label>
										<Input
											{...register("contactInfo.linkedIn")}
											type="text"
											placeholder="https://linkedin.com/in/your-profile"
										/>

										{errors.contactInfo?.linkedIn && (
											<p className="text-sm text-red-500">
												{errors.contactInfo.linkedIn.message}
											</p>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* Professional Summary */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-medium">Professional Summary</h3>
								<ToolTip type="Summary" />
							</div>
							<Controller
								name="summary"
								control={control}
								render={({ field }) => (
									<Textarea
										{...field}
										className="h-32"
										placeholder="Write a compelling professional summary..."
										error={errors.summary}
									/>
								)}
							/>

							{errors.summary && (
								<p className="text-sm text-red-500">{errors.summary.message}</p>
							)}

							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={handleImproveSummaryWithAI}
								disabled={isImprovingSummary || !watch("summary")}
							>
								{isImprovingSummary ? (
									<>
										<Loader2 className="size-4 mr-2 animate-spin" /> Improving
									</>
								) : (
									<>
										<Sparkles className="size-4 mr-2" /> Improve with AI
									</>
								)}
							</Button>
						</div>

						{/* Skills */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-medium">Skills</h3>
								<ToolTip type="Skills" />
							</div>
							<Controller
								name="skills"
								control={control}
								render={({ field }) => (
									<Textarea
										{...field}
										className="h-32"
										placeholder="List your key skills (e.g JavaScript, Microsoft Excel, Problem-solving, Collaboration)..."
										error={errors.skills}
									/>
								)}
							/>
							{errors.skills && (
								<p className="text-sm text-red-500">{errors.skills.message}</p>
							)}
						</div>

						{/* Work Experience */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Work Experience</h3>
							<Controller
								name="experience"
								control={control}
								render={({ field }) => (
									<EntryForm
										type="Experience"
										entries={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
							{errors.experience && (
								<p className="text-sm text-red-500">
									{errors.experience.message}
								</p>
							)}
						</div>

						{/* Projects */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Projects</h3>
							<Controller
								name="projects"
								control={control}
								render={({ field }) => (
									<EntryForm
										type="Project"
										entries={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
							{errors.projects && (
								<p className="text-sm text-red-500">
									{errors.projects.message}
								</p>
							)}
						</div>

						{/* Education */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Education</h3>
							<Controller
								name="education"
								control={control}
								render={({ field }) => (
									<EntryForm
										type="Education"
										entries={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
							{errors.education && (
								<p className="text-sm text-red-500">
									{errors.education.message}
								</p>
							)}
						</div>
					</form>
				</TabsContent>
				<TabsContent value="preview">
					<div className="flex items-center justify-between gap-4">
						<Button
							type="button"
							size="sm"
							onClick={handleGenerateAtsScore}
							disabled={isGeneratingAtsScoreAndFeedback}
						>
							{isGeneratingAtsScoreAndFeedback ? (
								<>
									<Loader2 className="size-4 mr-2 animate-spin" /> Generating...
								</>
							) : (
								"Generate ATS Score"
							)}
						</Button>

						{/* Resume ATS score and feedback */}
						<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
							<SheetTrigger asChild>
								<Button variant="ghost" disabled={!atsScore || !feedback}>
									Open Score
								</Button>
							</SheetTrigger>
							<SheetContent className="pt-12">
								<SheetHeader>
									<div className="text-center">
										<SheetTitle>Resume ATS Score:</SheetTitle>
										<div
											className={`text-center text-5xl my-10 font-bold ${
												atsScore > 75
													? "text-green-500"
													: atsScore > 50
													? "text-yellow-500"
													: "text-red-500"
											}`}
										>
											{atsScore}%
										</div>
									</div>
									<div className="space-y-2">
										<SheetTitle>Feedback:</SheetTitle>
										<SheetDescription>{feedback}</SheetDescription>
									</div>
								</SheetHeader>
							</SheetContent>
						</Sheet>
					</div>
					<div className="flex justify-center mt-5 min-h-screen bg-muted/50 lg:py-12 rounded-lg">
						<div className="bg-white shadow-lg p-8 w-[210mm] rounded-md">
							<div id="resume-pdf" className="text-black">
								<ResumeDisplay resumeContent={formValues} />
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ResumeBuilder;
