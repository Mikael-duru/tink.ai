import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";

import { auth, db } from "@/firebase/firebase";
import { Button } from "../../../components/ui/button";
import Image from "next/image";
import { storeUser } from "@/lib/cookieStore";

const SignInWithGoogle = () => {
	const router = useRouter();

	const handleGoogleLogin = async () => {
		const provider = new GoogleAuthProvider();

		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			const userId = user.uid;

			// Store userId in cookies
			await storeUser({ idToken: userId });

			if (user) {
				// Extract first name and last name from displayName
				const [firstName, lastName] = user.displayName
					? user.displayName.split(" ")
					: ["", ""];

				// Check if user document already exists in Firestore
				const userDocRef = doc(db, "users", user.uid);
				const userDocSnapshot = await getDoc(userDocRef);

				const userData = {
					firstName: firstName,
					lastName: lastName,
					email: user.email,
					id: user.uid,
					photoURL: user.photoURL,
					displayName: user.displayName,
					imgPublicId: "", //From cloudinary
				};

				if (!userDocSnapshot.exists()) {
					// Save user data to Firestore
					await setDoc(userDocRef, userData);
				}

				// Temporary store user data in local storage
				localStorage.setItem(
					"GoogleData",
					JSON.stringify({
						userData,
					})
				);

				router.push("/");
			}
		} catch (error) {
			let errorMessage;
			switch (error.code) {
				case "auth/popup-closed-by-user":
					errorMessage = "The popup was closed before completing the sign-in.";
					break;
				case "auth/operation-not-allowed":
					errorMessage = "Sign-in method not enabled.";
					break;
				case "auth/timeout":
					errorMessage = "The operation has timed out.";
					break;
				case "auth/too-many-requests":
					errorMessage =
						"Too many requests have been made. Please try again later.";
					break;
				case "auth/credential-already-in-use":
					errorMessage =
						"This credential is already associated with a different user account.";
					break;
				default:
					errorMessage = "Failed to log in. Please try again.";
			}
			console.log(errorMessage);
			toast.error(errorMessage);
		}
	};

	return (
		<>
			<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
				<span className="relative z-10 bg-background px-2 text-muted-foreground">
					Or
				</span>
			</div>
			<Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
				<Image
					src="/google-logo.png"
					width={20}
					height={20}
					alt="Google logo"
				/>
				<span className="ml-1">Continue with Google</span>
			</Button>
		</>
	);
};

export default SignInWithGoogle;
