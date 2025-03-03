"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { onboardingSchema } from "@/lib/schema";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { updateUser } from "@/actions/user";

const OnboardingForm = ({ industries }) => {
	const [selectedIndustry, setSelectedIndustry] = useState(null);
	const router = useRouter();

	const {
		isLoading,
		data: updateResult,
		fn: updateUserFn,
	} = useFetch(updateUser);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm({
		resolver: zodResolver(onboardingSchema),
	});

	const onSubmit = async (values) => {
		try {
			const formattedIndustry = `${values.industry}-${values.subIndustry
				.toLowerCase()
				.replace(/\s+/g, "-")}`; // Convert subIndustry value to lowercase and replace " " with "-"

			await updateUserFn({ ...values, industry: formattedIndustry });
		} catch (error) {
			console.error("Error updating user:", error);
		}
	};

	useEffect(() => {
		if (updateResult?.success && !isLoading) {
			toast.success("Profile completed successfully!");
			router.push("/dashboard");
			router.refresh();
		}
	}, [updateResult, isLoading]);

	const watchIndustry = watch("industry");

	return (
		<div className="flex items-center justify-center bg-background">
			<Card className="w-full max-w-lg mt-10 mx-2">
				<CardHeader>
					<CardTitle className="gradient-title text-3xl sm:text-4xl">
						Complete Your Profile
					</CardTitle>
					<CardDescription>
						Select your industry to get personalized career insights and
						recommendations
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
						{/* Industry */}
						<div className="space-y-2">
							<Label htmlFor="industry">Industry</Label>
							<Select
								onValueChange={(value) => {
									setValue("industry", value);
									setSelectedIndustry(
										industries.find((industry) => industry.id === value)
									);
									setValue("subIndustry", "");
								}}
							>
								<SelectTrigger id="industry">
									<SelectValue
										className="placeholder:text-sm"
										placeholder="Select an industry"
									/>
								</SelectTrigger>
								<SelectContent>
									{industries.map((industry) => {
										return (
											<SelectItem value={industry.id} key={industry.id}>
												{industry.name}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
							{errors.industry && (
								<p className="text-red-500 text-sm">
									{errors.industry.message}
								</p>
							)}
						</div>

						{/* Subindustry/Specialization */}
						{watchIndustry && (
							<div className="space-y-2">
								<Label htmlFor="subIndustry">Specialization</Label>
								<Select
									onValueChange={(value) => {
										setValue("subIndustry", value);
									}}
								>
									<SelectTrigger id="subIndustry">
										<SelectValue
											className="placeholder:text-sm"
											placeholder="Select your specialization"
										/>
									</SelectTrigger>
									<SelectContent>
										{selectedIndustry?.subIndustries.map((subInd) => {
											return (
												<SelectItem value={subInd} key={subInd}>
													{subInd}
												</SelectItem>
											);
										})}
									</SelectContent>
								</Select>
								{errors.subIndustry && (
									<p className="text-red-500 text-sm">
										{errors.subIndustry.message}
									</p>
								)}
							</div>
						)}

						{/* Experience */}
						<div className="space-y-2">
							<Label htmlFor="experience">Years of Experience</Label>
							<Input
								id="experience"
								type="number"
								min="0"
								max="50"
								placeholder="Enter years of experience"
								{...register("experience")}
								className="placeholder:text-sm"
							/>
							{errors.experience && (
								<p className="text-red-500 text-sm">
									{errors.experience.message}
								</p>
							)}
						</div>

						{/* Skills */}
						<div className="space-y-2">
							<Label htmlFor="skills">Skills</Label>
							<Input
								id="skills"
								placeholder="e.g. React, Python, Project Management, Product Design"
								{...register("skills")}
								className="placeholder:text-sm"
							/>
							<p className="text-xs text-muted-foreground">
								Separate multiple skills with a comma
							</p>
							{errors.skills && (
								<p className="text-red-500 text-sm">{errors.skills.message}</p>
							)}
						</div>

						{/* Professional Bio */}
						<div className="space-y-2">
							<Label htmlFor="bio">Professional Bio</Label>
							<Textarea
								id="bio"
								placeholder="Tell us about your professional background..."
								{...register("bio")}
								className="placeholder:text-sm h-32"
							/>
							{errors.bio && (
								<p className="text-red-500 text-sm">{errors.bio.message}</p>
							)}
						</div>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...{" "}
								</>
							) : (
								"Complete Profile"
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default OnboardingForm;
