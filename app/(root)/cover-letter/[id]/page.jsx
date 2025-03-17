import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCoverLetterById } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";

const EditCoverLetterPage = async ({ params }) => {
	const { id } = await params;
	const coverLetter = await getCoverLetterById(id);

	return (
		<div className="container mx-auto py-6">
			<div className="flex flex-col space-y-2">
				<Link href="/cover-letter" className="max-w-[200px] inline-block">
					<Button variant="link" className="gap-2 pl-0">
						<ArrowLeft className="h-4 w-4" />
						Back to Cover Letters
					</Button>
				</Link>

				<h1 className="text-[46px] leading-[1] md:text-6xl font-bold gradient-title mb-6">
					{coverLetter?.jobTitle} at {coverLetter?.companyName}
				</h1>
			</div>

			<div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mt-5 mb-2">
				<Info className="h-5 w-5 shrink-0" />
				<span className="text-sm">
					Please read through. Feel free to adjust any details to better match
					your situation!
				</span>
			</div>

			<CoverLetterPreview content={coverLetter?.content} />
		</div>
	);
};

export default EditCoverLetterPage;
