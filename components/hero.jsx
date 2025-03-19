"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { Button } from "./ui/button";

const HeroSection = ({ currentUser, isOnboarded }) => {
	const imageRef = useRef(null);

	useEffect(() => {
		const imageElement = imageRef.current;

		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const scrollThreshold = 100;

			if (scrollPosition > scrollThreshold) {
				imageElement.classList.add("scrolled");
			} else {
				imageElement.classList.remove("scrolled");
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<section className="w-full pt-36 md:pt-48 pb-16 overflow-hidden">
			<div className="text-center">
				<div className="space-y-6 mx-auto px-2">
					<h1 className="gradient-title text-4xl font-bold md:text-5xl lg:text-6xl xl:text-7xl">
						Your AI-Powered Career Coach <br /> for Professional Success.
					</h1>
					<p className="mx-auto max-w-[600px] sm:text-xl text-muted-foreground">
						Unlock career growth with AI-driven guidance, interview coaching,
						job market insights, and smart career tools.
					</p>

					<div className="w-[160px] mx-auto">
						<Link
							href={
								!currentUser
									? "/sign-in"
									: !isOnboarded
									? "/onboarding"
									: "/dashboard"
							}
						>
							<Button size="lg" className="px-8 w-full">
								Get Started
							</Button>
						</Link>
					</div>
				</div>

				<div className="hero-image-wrapper px-2">
					<div ref={imageRef} className="hero-image">
						<Image
							src={"/hero-banner.jpeg"}
							width={1280}
							height={720}
							alt="Banner for Tink.ai"
							className="rounded-lg shadow-2xl border mx-auto"
							priority
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
