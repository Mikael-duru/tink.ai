"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import HeroSection from "@/components/hero";
import { features } from "@/data/features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { howItWorks } from "@/data/howItWorks";
import { faqs } from "@/data/faqs";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import TestimonialSlider from "@/components/testimonial-slider";
import { Button } from "@/components/ui/button";
import { useGetUserInfo } from "@/hooks/get-user-info";

const Home = () => {
	const { user, isUserOnboarded } = useGetUserInfo();

	return (
		<div>
			<div className="grid-background"></div>

			<HeroSection currentUser={user} isOnboarded={isUserOnboarded} />

			{/* Features */}
			<section className="w-full py-16 md:py-24 lg:py-32 bg-background">
				<div className="container mx-auto px-4 md:px-6">
					<h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
						Powerful Features for Your Career Growth
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-sm:gap-8 gap-6 max-w-6xl mx-auto">
						{features.map((feature, index) => {
							return (
								<Card
									key={index}
									className="border-2 hover:border-primary transition-colors duration-300 text-center"
								>
									<CardHeader className="flex items-center justify-center flex-col">
										{feature.icon}
										<CardTitle className="text-xl font-bold">
											{feature.title}
										</CardTitle>
									</CardHeader>
									<CardContent className="text-muted-foreground">
										<p>{feature.description}</p>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			{/* How it wprks */}
			<section className="w-full py-16 md:py-24 lg:py-32 bg-background">
				<div className="container mx-auto px-4 md:px-6">
					<div className="text-center max-w-3xl mx-auto mb-12">
						<h2 className="text-3xl font-bold mb-4">How It works</h2>
						<p className="text-muted-foreground">
							Four simple steps to accelerate your career growth
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-12 max-w-6xl mx-auto">
						{howItWorks.map((item, index) => {
							return (
								<div
									className="flex flex-col items-center text-center space-y-4"
									key={index}
								>
									<div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
										{item.icon}
									</div>
									<h3 className="font-semibold text-xl">{item.title}</h3>
									<p className="text-muted-foreground">{item.description}</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<TestimonialSlider />

			{/* FAQs */}
			<section className="w-full py-16 md:py-24 lg:py-32 bg-background">
				<div className="container mx-auto px-4 md:px-6">
					<div className="text-center max-w-3xl mx-auto mb-12">
						<h2 className="text-3xl font-bold mb-4">
							Frequently Asked Questions
						</h2>
						<p className="text-muted-foreground">
							Find answers to common questions about our platform
						</p>
					</div>
					<div className="max-w-6xl mx-auto">
						<Accordion type="single" collapsible className="max-w-4xl mx-auto">
							{faqs.map((faq, index) => {
								return (
									<AccordionItem value={`item-${index}`} key={index}>
										<AccordionTrigger className="text-start">
											{faq.question}
										</AccordionTrigger>
										<AccordionContent className="pr-4 md:pr-8">
											{faq.answer}
										</AccordionContent>
									</AccordionItem>
								);
							})}
						</Accordion>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="w-full">
				<div className="mx-auto py-24 gradient rounded-lg">
					<div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto px-2">
						<h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
							Ready to Accelerate Your Career?
						</h2>
						<p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
							Join thousands of professionals who are advancing their careers
							with AI-powered guidance.
						</p>
						<Link
							href={
								!user
									? "/sign-in"
									: !isUserOnboarded
									? "/onboarding"
									: "/dashboard"
							}
							passHref
						>
							<Button
								size="lg"
								variant="secondary"
								className="h-11 mt-5 animate-bounce"
							>
								Start Your Journey Today <ArrowRight className="ml-2 size-4" />
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
