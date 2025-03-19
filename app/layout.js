import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ToasterProvider } from "@/lib/toastProvider";
import HeaderComponent from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import FooterComponent from "@/components/footer";

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
					<HeaderComponent />

					{/* content */}
					<main className="min-h-screen">{children}</main>
					<Toaster richColors />

					{/* footer */}
					<FooterComponent />
				</ThemeProvider>
			</body>
		</html>
	);
}
