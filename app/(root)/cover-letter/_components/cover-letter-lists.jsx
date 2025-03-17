"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCoverLetterById } from "@/actions/cover-letter";

const CoverLetterList = ({ coverLetters }) => {
	const router = useRouter();

	const handleDeleteCoverLetter = async (id) => {
		try {
			await deleteCoverLetterById(id);
			toast.success("Cover letter deleted successfully!");
			router.refresh();
		} catch (error) {
			toast.error(error.message || "Failed to delete cover letter");
		}
	};

	if (!coverLetters?.length) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>No Cover Letter Yet</CardTitle>
					<CardDescription>
						To create your first cover letter click on the "create new" button
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			{coverLetters.map((letter) => (
				<Card key={letter.id} className="group relative ">
					<CardHeader>
						<div className="flex items-start justify-between">
							<div>
								<CardTitle className="text-xl gradient-title">
									{letter.jobTitle} at {letter.companyName}
								</CardTitle>
								<CardDescription>
									Created {format(new Date(letter.createdAt), "PPP")}
								</CardDescription>
							</div>
							<div className="flex space-x-2">
								<Button
									variant="outline"
									size="icon"
									onClick={() => router.push(`/cover-letter/${letter.id}`)}
								>
									<Eye className="h-4 w-4" />
								</Button>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="outline" size="icon">
											<Trash2 className="h-4 w-4" />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent className="max-sm:w-[95%]">
										<AlertDialogHeader>
											<AlertDialogTitle>Delete Cover Letter?</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently
												delete your cover letter for {letter.jobTitle} at{" "}
												{letter.companyName}.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => handleDeleteCoverLetter(letter.id)}
												className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
											>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-muted-foreground text-sm line-clamp-3">
							{letter.jobDescription}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default CoverLetterList;
