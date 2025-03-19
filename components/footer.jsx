"use client";

import { usePathname } from "next/navigation";

const FooterComponent = () => {
	const pathname = usePathname();

	// Check if the path starts with "sign-in" or "sign-up"
	const isAuthPage =
		pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

	return !isAuthPage ? (
		<footer className="bg-muted/50 py-12">
			<div className="container mx-auto px-4 text-center">
				<p className="text-gray-200">Made by Mikael Duru 👍 2025</p>
			</div>
		</footer>
	) : null;
};

export default FooterComponent;
