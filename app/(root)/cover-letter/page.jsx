import Link from "next/link";
import { Plus } from "lucide-react";

import { getAllCoverLetter } from "@/actions/cover-letter";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-lists";

const CoverLetterPage = async () => {
	const coverLetters = await getAllCoverLetter();

	return (
		<div>
			<div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between mb-5">
				<h1 className="text-5xl md:text-6xl font-bold gradient-title">
					My Cover Letters
				</h1>
				<Link href="/cover-letter/new">
					<Button>
						<Plus className="h-4 w-4 mr-2" />
						Create New
					</Button>
				</Link>
			</div>

			<CoverLetterList coverLetters={coverLetters} />
		</div>
	);
};

export default CoverLetterPage;
