import { NextResponse } from "next/server";

/**
 * Checks if the user is logged in and redirects to the login page if not.
 */
export function middleware(req) {
	const { pathname } = req.nextUrl;
	const authCookie = req.cookies.get("__session")?.value;

	// List of paths that don't require authentication
	const publicRoutes = ["/sign-in", "/sign-up"];

	// If the user is trying to access a public route, allow access
	if (publicRoutes.some((path) => pathname.startsWith(path))) {
		return NextResponse.next();
	}

	// If the user is trying to access a protected route, check if they are logged in
	if (pathname !== "/" && !authCookie) {
		// If the user is not logged in, redirect to the login page
		return NextResponse.redirect(new URL("/sign-in", req.url));
	}

	// If the user is logged in, allow access to the requested page
	return NextResponse.next();
}

export const config = {
	matcher: "/((?!api|_next/static|_next/image|assets|favicon.ico).*)", // Exclude API endpoints, static files, and optimized images.
};
