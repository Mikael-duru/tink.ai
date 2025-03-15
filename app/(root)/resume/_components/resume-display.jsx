import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const ResumeDisplay = ({ resumeContent }) => {
	const { contactInfo, summary, skills, experience, projects, education } =
		resumeContent;

	return (
		<div className="space-y-4" style={{ fontFamily: "Times New Roman, serif" }}>
			<header className="text-center">
				{contactInfo?.fullName && (
					<>
						<hgroup>
							<h1 className="text-2xl sm:text-3xl font-bold">
								{contactInfo?.fullName}
							</h1>
							<h2 className="sm:text-xl font-medium pt-1">
								{contactInfo?.jobTitle}
							</h2>
						</hgroup>
					</>
				)}
				<div className="flex gap-2 flex-wrap items-center justify-center text-sm py-2">
					<Link href={`tel:${contactInfo?.phoneNumber}` || ""}>
						{contactInfo?.phoneNumber}
					</Link>
					{contactInfo?.email && (
						<>
							|
							<Link href={`mailto:${contactInfo?.email}` || ""}>
								{contactInfo?.email}
							</Link>
						</>
					)}
					{contactInfo?.location && (
						<>
							| <span>{contactInfo?.location}</span>
						</>
					)}

					{contactInfo?.linkedIn && (
						<>
							|
							<Link
								href={`${contactInfo?.linkedIn}` || ""}
								className="text-blue-500 hover:underline"
							>
								LinkedIn Profile
							</Link>
						</>
					)}
				</div>
			</header>

			{/* Professional summary */}
			{summary && (
				<section>
					<h2 className="font-bold text-sm">PROFESSIONAL SUMMARY</h2>
					<Separator className="mt-2 mb-1" />
					<p className="text-[13px] leading-[1.4]">{summary}</p>
				</section>
			)}

			{/* Skills */}
			{skills && (
				<section>
					<h2 className="font-bold text-sm">SKILLS</h2>
					<Separator className="mt-2 mb-1" />
					<ul
						className={`text-[13px] leading-[1.4] ${
							skills.split(",").length > 4 && "grid grid-cols-3"
						}`}
					>
						{skills.split(",").map((skill, index) => (
							<li key={index}>
								<span className="capitalize">{skill.trim()}</span>
							</li>
						))}
					</ul>
				</section>
			)}

			{/* Work Experience */}
			{experience.length > 0 && (
				<section>
					<h2 className="font-bold text-sm">WORK EXPERIENCE</h2>
					<Separator className="mt-2 mb-1" />
					{experience.map((entry, index) => {
						return (
							<div className="space-y-[2px] mb-2" key={index}>
								<h3 className="text-[13px] leading-[1.4]">
									<span className="font-bold capitalize">{entry?.title}</span>
									&nbsp; | &nbsp;{entry?.organization}
								</h3>
								<p className="text-[13px] leading-[1.4] text-gray-500">{`${entry.startDate} – ${entry.endDate}`}</p>
								<ul className="pl-5">
									{entry.description
										.split(".")
										.filter((sentence) => sentence.trim() !== "")
										.map((sentence, index) => (
											<li key={index} className="flex items-center gap-2.5">
												<span className="text-[13px] leading-[1.4]">●</span>
												<div className="text-[13px] leading-[1.4]">
													{sentence.trim()}.
												</div>
											</li>
										))}
								</ul>
							</div>
						);
					})}
				</section>
			)}

			{/* Projects */}
			{projects.length > 0 && (
				<section>
					<h2 className="font-bold text-sm">PROJECTS</h2>
					<Separator className="mt-2 mb-1" />
					{projects.map((entry, index) => {
						return (
							<div className="space-y-[2px] mb-2" key={index}>
								<h3 className="text-[13px] leading-[1.4]">
									<span className="font-bold capitalize">{entry?.title}</span>
									&nbsp; | &nbsp;
									<Link href={entry.projectURL} className="text-blue-500">
										Live Demo
									</Link>
								</h3>
								<ul className="pl-5">
									{entry.description
										.split(".")
										.filter((sentence) => sentence.trim() !== "")
										.map((sentence, index) => (
											<li key={index} className="flex items-center gap-2.5">
												<span className="text-[13px] leading-[1.4]">●</span>
												<div className="text-[13px] leading-[1.4]">
													{sentence.trim()}.
												</div>
											</li>
										))}
								</ul>
							</div>
						);
					})}
				</section>
			)}

			{/* Education */}
			{education.length > 0 && (
				<section>
					<h2 className="font-bold text-sm">EDUCATION</h2>
					<Separator className="mt-2 mb-1" />
					{education.map((entry, index) => {
						return (
							<div className="space-y-[2px] mb-2" key={index}>
								<h3 className="text-sm">
									<span className="font-bold capitalize block">
										{entry?.title}
									</span>
									{entry.organization}
								</h3>
								<p className="text-[13px] leading-[1.4] text-gray-500">{`${entry.startDate} – ${entry.endDate}`}</p>
							</div>
						);
					})}
				</section>
			)}
		</div>
	);
};

export default ResumeDisplay;
