import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { auth, db } from "@/firebase/firebase";
import { Button } from "../../../components/ui/button";
import Image from "next/image";
import { storeUser } from "@/lib/cookieStore";
import { getUserOnboardingStatus } from "@/actions/user";

const SignInWithGoogle = () => {
	const router = useRouter();

	const handleGoogleLogin = async () => {
		try {
			const result = await signInWithPopup(auth, new GoogleAuthProvider());
			const user = result.user;

			// Store userId in cookies
			await storeUser({ idToken: user.uid });

			// Store user data to Firestore if it doesn't already exist
			const userDocRef = doc(db, "users", user.uid);
			const userDocSnapshot = await getDoc(userDocRef);
			if (!userDocSnapshot.exists()) {
				await setDoc(userDocRef, {
					firstName: user.displayName.split(" ")[0],
					lastName: user.displayName.split(" ")[1],
					email: user.email,
					id: user.uid,
					photoURL: user.photoURL,
					displayName: user.displayName,
					imgPublicId: "", //From cloudinary
				});
			}

			// Redirect to onboarding if the user is not already onboarded
			const { isOnboarded } = await getUserOnboardingStatus();
			if (!isOnboarded) {
				router.push("/onboarding");
			} else {
				router.push("/");
			}
		} catch (error) {
			console.error(error.message);
			toast.error("Failed to log in. Please try again.");
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
