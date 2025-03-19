"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import {
	ChevronDown,
	FileText,
	GraduationCap,
	LayoutDashboard,
	PenBox,
	StarsIcon,
} from "lucide-react";
import { auth, db } from "@/firebase/firebase";
import AvatarDropdown from "./avatar-dropdown";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { checkUserSession, deleteStoredUser } from "@/lib/cookieStore";
import { getUserOnboardingStatus } from "@/actions/user";

const Header = () => {
	const [user, setUser] = useState(null);
	const [firstName, setFirstName] = useState("");
	const [photoURL, setPhotoURL] = useState("");
	const [userOnboarded, setUserOnboarded] = useState(false);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const confirmUserCookie = async () => {
			const { cookieExpired } = await checkUserSession();
			console.log("Cookie expired:", cookieExpired);

			if (cookieExpired) {
				await signOut(auth);
				resetUserState();
			}
		};

		confirmUserCookie();
	}, [router]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
			setUser(authUser);
			if (authUser) {
				const userDocRef = doc(db, "users", authUser.uid);
				try {
					const unsubscribeDoc = onSnapshot(userDocRef, async (docSnapshot) => {
						if (docSnapshot.exists()) {
							// Firestore has user data
							const userData = docSnapshot.data();
							setFirstName(userData.firstName || "");
							setPhotoURL(userData.photoURL || "");

							localStorage.removeItem("GoogleData");
						} else {
							// Try recovering Google-stored data
							const googleStoredData = JSON.parse(
								localStorage.getItem("GoogleData")
							);
							if (googleStoredData) {
								await setDoc(userDocRef, googleStoredData);

								localStorage.removeItem("GoogleData");

								const createdUserDoc = await getDoc(userDocRef);
								if (createdUserDoc.exists()) {
									const userData = createdUserDoc.data();
									setFirstName(userData.firstName || "");
									setPhotoURL(userData.photoURL || "");
								}
							}
						}
					});

					const { isOnboarded } = await getUserOnboardingStatus();

					setUserOnboarded(isOnboarded);

					return () => unsubscribeDoc();
				} catch (error) {
					console.error("Error fetching user data from Firestore:", error);
				}
			} else {
				resetUserState();
			}

			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const resetUserState = () => {
		setUser(null);
		setFirstName("");
		setPhotoURL("");
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
			await deleteStoredUser();
			resetUserState();
			toast.success("Goodbye and Fighting! 😊");
			router.push("/");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	// Check if the path starts with "sign-in" or "sign-up"
	const isAuthPage =
		pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

	const isUserOnboarding = pathname.startsWith("/onboarding");

	return !isAuthPage ? (
		<header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
			<nav className="container mx-auto px-4 h-16 flex items-center justify-between">
				<Link href="/">
					<Image
						src={"/assets/ai-logo.png"}
						alt="Tink.ai Logo"
						width={200}
						height={60}
						className="max-h-10 py-1 w-auto object-contain"
					/>
				</Link>

				<div className="flex items-center space-x-2 sm:space-x-4">
					{user ? (
						<>
							<Button
								variant="outline"
								onClick={() => {
									!userOnboarded
										? router.push("/onboarding")
										: router.push("/dashboard");
								}}
								className={`${isUserOnboarding ? "hidden" : "max-sm:hidden"}`}
							>
								<LayoutDashboard size={16} />
								<span className="max-sm:hidden">Industry Insights</span>
							</Button>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button className={`${isUserOnboarding ? "hidden" : ""}`}>
										<StarsIcon size={16} />
										<span className="max-md:hidden">Growth Tools</span>
										<ChevronDown size={16} />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="mt-1">
									<Link href={!userOnboarded ? "/onboarding" : "/resume"}>
										<DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
											<FileText size={16} />
											Build Resume
										</DropdownMenuItem>
									</Link>
									<DropdownMenuItem
										onClick={() =>
											!userOnboarded
												? router.push("/onboarding")
												: router.push("/cover-letter")
										}
										className="flex items-center gap-2 cursor-pointer"
									>
										<PenBox size={16} />
										Cover Letter
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() =>
											!userOnboarded
												? router.push("/onboarding")
												: router.push("/interview")
										}
										className="flex items-center gap-2 cursor-pointer"
									>
										<GraduationCap size={16} />
										Interview Prep
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>

							<AvatarDropdown
								handleLogout={handleLogout}
								user={user}
								firstName={firstName}
								photoURL={photoURL}
								userOnboarded={userOnboarded}
							/>
						</>
					) : (
						<Button onClick={() => router.push("/sign-in")} variant="outline">
							Sign In
						</Button>
					)}
				</div>
			</nav>
		</header>
	) : null;
};

export default Header;
