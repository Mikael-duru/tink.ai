"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import {
	ChevronDown,
	FileText,
	GraduationCap,
	LayoutDashboard,
	PenBox,
	StarsIcon,
} from "lucide-react";
import { deleteCookie } from "cookies-next";

import { auth, db } from "@/firebase/firebase";
import AvatarDropdown from "./avatar-dropdown";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
	const [user, setUser] = useState(null);
	const [firstName, setFirstName] = useState("");
	const [photoURL, setPhotoURL] = useState("");
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
			if (!authUser) {
				resetUserState();
				return;
			}

			setUser(authUser);
			const userDocRef = doc(db, "users", authUser.uid);

			const unsubscribeDoc = onSnapshot(userDocRef, async (docSnapshot) => {
				if (docSnapshot.exists()) {
					// Firestore has user data
					const userData = docSnapshot.data();
					setFirstName(userData.firstName || "");
					setPhotoURL(userData.photoURL || "");
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

			return () => unsubscribeDoc();
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
			deleteCookie("__session");
			resetUserState();
			toast.success("Goodbye and Fighting! 😊");
			router.push("/");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	return (
		<header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
			<nav className="container mx-auto px-4 h-16 flex items-center justify-between">
				<Link href="/">
					<Image
						src="/logo.png"
						alt="Tink.ai Logo"
						width={200}
						height={60}
						className="h-12 py-1 w-auto object-contain"
					/>
				</Link>

				<div className="flex items-center space-x-2 sm:space-x-4">
					{user ? (
						<>
							<Link href={"/dashboard"} className="max-sm:hidden">
								<Button variant="outline">
									<LayoutDashboard size={16} />
									<span className="max-sm:hidden">Industry Insights</span>
								</Button>
							</Link>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button>
										<StarsIcon size={16} />
										<span className="max-md:hidden">Growth Tools</span>
										<ChevronDown size={16} />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="mt-1">
									<DropdownMenuItem>
										<Link href="/resume" className="flex items-center gap-2">
											<FileText size={16} />
											Build Resume
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Link
											href="/ai-cover-letter"
											className="flex items-center gap-2"
										>
											<PenBox size={16} />
											Cover Letter
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Link href="/interview" className="flex items-center gap-2">
											<GraduationCap size={16} />
											Interview Prep
										</Link>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>

							<AvatarDropdown
								handleLogout={handleLogout}
								user={user}
								firstName={firstName}
								photoURL={photoURL}
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
	);
};

export default Header;
