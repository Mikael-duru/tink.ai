import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ToasterProvider } from "@/lib/toastProvider";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
	subsets: ["latin"],
});

export const metadata = {
	title: "Tink.ai - AI Career Coach",
	description:
		"Unlock your potential with our AI career coach. Get personalized advice, resume tips, interview prep, and job market insights today!",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className}`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<ToasterProvider />
					{/* header */}
					<Header />

					{/* content */}
					<main className="min-h-screen">{children}</main>
					<Toaster richColors />

					{/* footer */}
					<footer className="bg-muted/50 py-12">
						<div className="container mx-auto px-4 text-center">
							<p className="text-gray-200">Made by Mikael Duru 👍 2025</p>
						</div>
					</footer>
				</ThemeProvider>
			</body>
		</html>
	);
}
