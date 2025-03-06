"use client";

import {
	Brain,
	BriefcaseIcon,
	LineChart,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const DashboardView = ({ insights }) => {
	const salaryData = insights.salaryRanges.map((range) => ({
		name: range.role,
		min: range.min / 1000,
		max: range.max / 1000,
		median: range.median / 1000,
	}));

	const getDemandLevelColor = (demandLevel) => {
		switch (demandLevel.toLowerCase()) {
			case "high":
				return "bg-green-500";
			case "medium":
				return "bg-yellow-500";
			case "low":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	const getMarketOutlookStyle = (marketOutlook) => {
		switch (marketOutlook.toLowerCase()) {
			case "positive":
				return { icon: TrendingUp, color: "text-green-500" };
			case "neutral":
				return { icon: LineChart, color: "text-yellow-500" };
			case "negative":
				return { icon: TrendingDown, color: "text-red-500" };
			default:
				return { icon: LineChart, color: "text-gray-500" };
		}
	};

	const OutlookIcon = getMarketOutlookStyle(insights.marketOutlook).icon;
	const outlookColor = getMarketOutlookStyle(insights.marketOutlook).color;

	const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");

	const nextUpdateDistance = formatDistanceToNow(
		new Date(insights.nextUpdate),
		{
			addSuffix: true,
		}
	);

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-center max-sm:mb-10">
				<Badge variant="outline">Last Updated: {lastUpdatedDate}</Badge>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-sm:mb-20">
				{/* Market Outlook */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Market Outlook
						</CardTitle>
						<OutlookIcon className={`size-4 ${outlookColor}`} />
					</CardHeader>
					<CardContent>
						<h2 className="text-2xl font-bold">{insights.marketOutlook}</h2>
						<p className="text-muted-foreground text-xs">
							Next update {nextUpdateDistance}
						</p>
					</CardContent>
				</Card>

				{/* Industry Growth */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Industry Growth
						</CardTitle>
						<TrendingUp className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<h2 className="text-2xl font-bold">
							{insights.growthRate.toFixed(1)}%
						</h2>
						<Progress value={insights.growthRate} className="mt-2" />
					</CardContent>
				</Card>

				{/* Demand Level */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Demand Level</CardTitle>
						<BriefcaseIcon className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<h2 className="text-2xl font-bold">{insights.demandLevel}</h2>
						<Progress
							value={100}
							className="mt-2"
							demandLevel={insights.demandLevel}
							getDemandLevelColor={getDemandLevelColor}
						/>
					</CardContent>
				</Card>

				{/* Top Skills */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Top Skills</CardTitle>
						<Brain className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-1">
							{insights.topSkills.map((skill) => {
								return (
									<Badge key={skill} variant="secondary">
										{skill}
									</Badge>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Salary Chart */}
			<Card>
				<CardHeader>
					<CardTitle>Salary Ranges by Role</CardTitle>
					<CardDescription>
						Highlighting minimum, median, and maximum salary values (in
						thousands).
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="h-[400px] overflow-x-auto">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={salaryData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip
									content={({ active, payload, label }) => {
										if (active && payload && payload.length) {
											return (
												<div className="bg-background border rounded-lg p-2 shadow-md">
													<p className="font-medium">{label}</p>
													{payload.map((item) => (
														<p className="text-sm" key={item.name}>
															{item.name}: ${item.value}K
														</p>
													))}
												</div>
											);
										}
										return null;
									}}
								/>
								<Bar dataKey="min" fill="#A3B9C8" name="Min Salary (K)" />
								<Bar dataKey="median" fill="#7A9AAE" name="Median Salary (K)" />
								<Bar dataKey="max" fill="#586C77" name="Max Salary (K)" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>

			{/* Key Industry Trends and Recommended Skills */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{/* Key Industry Trends */}
				<Card>
					<CardHeader>
						<CardTitle>Key Industry Trends</CardTitle>
						<CardDescription>
							Current trends shaping the industry.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-4">
							{insights.keyTrends.map((trend, index) => (
								<li key={index} className="flex items-start space-x-2">
									<div className="size-2 mt-2 rounded-full bg-primary" />
									<span>{trend}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				{/* Recommended Skills */}
				<Card>
					<CardHeader>
						<CardTitle>Recommended Skills</CardTitle>
						<CardDescription>Skills to consider developing.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{insights.recommendedSkills.map((skill) => (
								<Badge key={skill} variant={"secondary"}>
									{skill}
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default DashboardView;
