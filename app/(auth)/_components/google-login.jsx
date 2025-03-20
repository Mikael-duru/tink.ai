"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { auth, db } from "@/firebase/firebase";
import { Button } from "../../../components/ui/button";
import { storeUser } from "@/lib/cookieStore";
import Image from "next/image";

const SignInWithGoogle = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleGoogleLogin = async () => {
		try {
			setIsLoading(true);

			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			// Store userId in cookies
			await storeUser({ idToken: user.uid });

			const userData = {
				firstName: user.displayName.split(" ")[0],
				lastName: user.displayName.split(" ")[1],
				email: user.email,
				id: user.uid,
				photoURL: user.photoURL,
				displayName: user.displayName,
				imgPublicId: "", //From cloudinary
			};

			localStorage.setItem(
				"GoogleData",
				JSON.stringify({
					userData,
				})
			);

			// Store user data to Firestore if it doesn't already exist
			const userDocRef = doc(db, "users", user.uid);
			const userDocSnapshot = await getDoc(userDocRef);
			if (!userDocSnapshot.exists()) {
				await setDoc(userDocRef, userData);
			}

			router.push("/onboarding");
		} catch (error) {
			console.log(error.message);
			toast.error("Failed to log in. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
				<span className="relative z-10 bg-background px-2 text-muted-foreground">
					Or
				</span>
			</div>
			<Button
				variant="outline"
				className="w-full"
				onClick={handleGoogleLogin}
				disabled={isLoading}
			>
				{isLoading ? (
					<>
						<Loader2 size={20} className="animate-spin" />
					</>
				) : (
					<>
						{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path
								d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
								fill="currentColor"
							/>
						</svg> */}
						<Image
							src="/assets/google-logo.png"
							alt="Google Logo"
							width={20}
							height={20}
						/>
						<span className="ml-1">Continue with Google</span>
					</>
				)}
			</Button>
		</>
	);
};

export default SignInWithGoogle;
