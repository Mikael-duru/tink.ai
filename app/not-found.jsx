import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
	return (
		<div className="flex flex-col items-center justify-center gap-4 min-h-[100vh] px-4 text-center">
			<h1 className="text-6xl font-bold gradient-title">404</h1>
			<h2 className="text-2xl font-semibold">Page not found</h2>
			<p className="text-muted-foreground mb-4">
				OOps! The page you&apos;re looking for doesn&apos;t exist or has been
				moved.
			</p>
			<Link href="/">
				<Button>Return Home</Button>
			</Link>
		</div>
	);
};

export default NotFoundPage;
