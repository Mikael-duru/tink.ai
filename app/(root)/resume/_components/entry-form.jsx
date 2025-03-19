"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical, Loader2, Plus, Sparkles, X } from "lucide-react";
import { format, parse } from "date-fns";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { Button } from "@/components/ui/button";
import { resumeEntrySchema } from "@/lib/schema";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { improveWithAI } from "@/actions/resume";
import useFetch from "@/hooks/use-fetch";
import ToolTip from "./tool-tip";
import Link from "next/link";

const formatDate = (dateString) => {
	if (!dateString) return "";

	const date = parse(dateString, "yyyy-MM", new Date());
	return format(date, "MMM yyyy");
};

const EntryForm = ({ type, entries, onChange }) => {
	const [isAdding, setIsAdding] = useState(false);

	const {
		register,
		handleSubmit: handleValidation,
		reset,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(resumeEntrySchema(type)),
		defaultValues: {
			title: "",
			organization: "",
			projectURL: "",
			startDate: "",
			endDate: "",
			description: "",
			current: false,
		},
	});

	const current = watch("current");

	const {
		isLoading: isImprovingDescription,
		fn: improveWithAIFn,
		data: improveDescriptionContent,
		error: improveDescriptionError,
	} = useFetch(improveWithAI);

	const handleAdd = handleValidation((data, e) => {
		e.preventDefault();

		const formattedEntry = {
			...data,
			startDate: formatDate(data.startDate),
			endDate: data.current ? "Present" : formatDate(data.endDate),
		};

		onChange([...entries, formattedEntry]);

		reset();
		setIsAdding(false);
	});

	const handleDelete = (index) => {
		const newEntries = entries.filter((_, i) => i !== index);
		onChange(newEntries);
	};

	useEffect(() => {
		if (improveDescriptionContent && !isImprovingDescription) {
			setValue("description", improveDescriptionContent);
			toast.success("Description improved successfully!");
		}
	}, [
		improveDescriptionContent,
		isImprovingDescription,
		improveDescriptionError,
	]);

	const handleImproveDescriptionWithAI = async () => {
		const { description, title } = getValues();
		if (!description || !title) {
			toast.error("Please fill in both title and description!");
			return;
		}

		await improveWithAIFn({
			type: type.toLowerCase(),
			title,
			current: description,
		});
	};

	const placeholders = {
		Education: {
			title: "Degree Title",
			organization: "Awarding Institution",
		},
		Project: {
			title: "Project Title",
			projectURL: "Live Demo URL",
			description: "Description of project...",
		},
		Experience: {
			title: "Job Title/Position",
			organization: "e.g Tech Studio (Lagos, Nigeria)",
			description: "Description of your experience...",
		},
	};

	const handleDragEnd = (result) => {
		if (!result.destination) return;
		const reorderedEntries = Array.from(entries);
		const [movedItem] = reorderedEntries.splice(result.source.index, 1);
		reorderedEntries.splice(result.destination.index, 0, movedItem);
		onChange(reorderedEntries);
	};

	return (
		<div className="space-y-4">
			{/* Display added entries */}
			<div className="space-y-4">
				<DragDropContext onDragEnd={handleDragEnd}>
					<Droppable droppableId="entries">
						{(provided) => (
							<div
								{...provided.droppableProps}
								ref={provided.innerRef}
								className="space-y-3"
							>
								{entries.map((entry, index) => (
									<Draggable
										key={index}
										draggableId={index.toString()}
										index={index}
									>
										{(provided) => (
											<Card
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
											>
												<CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2 pl-4">
													<div className="flex items-start gap-2">
														<span
															{...provided.dragHandleProps}
															className="pt-1"
														>
															<GripVertical className="size-4 text-gray-500 hover:text-gray-700" />
														</span>
														<CardTitle className="text-sm font-medium">
															{entry.title}
															{type === "Project" ? (
																<Link
																	href={entry.projectURL || ""}
																	className="text-blue-500 hover:underline block mt-1"
																>
																	Live Demo
																</Link>
															) : (
																<span className="block">
																	{entry.organization}
																</span>
															)}
														</CardTitle>
													</div>
													<Button
														variant="destructive"
														size="sm"
														type="button"
														onClick={() => handleDelete(index)}
													>
														<X className="size-4" />
													</Button>
												</CardHeader>
												<CardContent className="pl-10">
													{type !== "Project" && (
														<p className="text-xs text-muted-foreground mb-2">
															{`${entry.startDate} – ${entry.endDate}`}
														</p>
													)}
													<ul className="text-xs pl-5">
														{entry.description
															.split("\n")
															.filter((sentence) => sentence.trim() !== "")
															.map((sentence, i) => (
																<li
																	key={i}
																	className="flex items-start space-x-2"
																>
																	<div className="size-2 mt-1.5 rounded-full bg-primary shrink-0" />
																	<span className="text-sm">
																		{sentence.trim()}
																	</span>
																</li>
															))}
													</ul>
												</CardContent>
											</Card>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>

			{/* Open form to add new entry */}
			{isAdding && (
				<Card>
					<CardHeader>
						<CardTitle>Add {type}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Title */}
							<div className="space-y-2">
								<Label htmlFor="title">Title</Label>
								<Input
									id="title"
									placeholder={placeholders[type]?.title}
									{...register("title")}
									error={errors.title}
								/>
								{errors.title && (
									<p className="text-sm text-red-500">{errors.title.message}</p>
								)}
							</div>

							{/* Organization/Company or project demo */}
							{type === "Project" ? (
								<div className="space-y-2">
									<Label>Project Demo</Label>
									<Input
										placeholder={placeholders[type]?.projectURL}
										{...register("projectURL")}
										error={errors.projectURL}
									/>
									{errors.projectURL && (
										<p className="text-sm text-red-500">
											{errors.projectURL.message}
										</p>
									)}
								</div>
							) : (
								<div className="space-y-2">
									<Label>Organization/Company</Label>
									<Input
										placeholder={placeholders[type]?.organization}
										{...register("organization")}
										error={errors.organization}
									/>
									{errors.organization && (
										<p className="text-sm text-red-500">
											{errors.organization.message}
										</p>
									)}
								</div>
							)}
						</div>

						{/* Start date and end date */}
						{type !== "Project" && (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Start Date</Label>
									<Input
										type="month"
										{...register("startDate")}
										error={errors.startDate}
									/>
									{errors.startDate && (
										<p className="text-sm text-red-500">
											{errors.startDate.message}
										</p>
									)}
								</div>
								<div className="space-y-4">
									<div className="space-y-2">
										<Label>End Date</Label>
										<Input
											type="month"
											{...register("endDate")}
											disabled={current}
											error={errors.endDate}
										/>
										{errors.endDate && (
											<p className="text-sm text-red-500">
												{errors.endDate.message}
											</p>
										)}
									</div>
									<div className="flex items-center space-x-2">
										<input
											type="checkbox"
											id="current"
											{...register("current")}
											onChange={(e) => {
												setValue("current", e.target.checked);
												if (e.target.checked) setValue("endDate", "");
											}}
										/>
										<Label htmlFor="current">Current</Label>
									</div>
								</div>
							</div>
						)}

						{/* Description */}
						{type !== "Education" && (
							<div className="flex flex-col items-end gap-2">
								<ToolTip type={type} />
								<div className="space-y-2 w-full">
									<Textarea
										placeholder={placeholders[type]?.description}
										className="h-32"
										{...register("description")}
										error={errors.description}
									/>
									{errors.description && (
										<p className="text-sm text-red-500">
											{errors.description.message}
										</p>
									)}
								</div>
							</div>
						)}

						{/* AI improvement button */}
						{type !== "Education" && (
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={handleImproveDescriptionWithAI}
								disabled={
									isImprovingDescription ||
									!watch("title") ||
									!watch("description")
								}
							>
								{isImprovingDescription ? (
									<>
										<Loader2 className="size-4 mr-2 animate-spin" /> Improving
									</>
								) : (
									<>
										<Sparkles className="size-4 mr-2" /> Improve with AI
									</>
								)}
							</Button>
						)}
					</CardContent>

					{/* add or cancel entry */}
					<CardFooter className="flex justify-end space-x-2">
						<Button type="button" onClick={handleAdd}>
							<Plus className="size-4" /> Add Entry
						</Button>

						<Button
							type="button"
							variant="outline"
							onClick={() => {
								reset();
								setIsAdding(false);
							}}
						>
							Cancel
						</Button>
					</CardFooter>
				</Card>
			)}

			{/* Button to add more entry */}
			{!isAdding && (
				<Button
					className="w-full mt-4"
					variant="outline"
					onClick={() => setIsAdding(true)}
				>
					<Plus className="size-4 mr-2" /> Add {type}
				</Button>
			)}
		</div>
	);
};

export default EntryForm;
