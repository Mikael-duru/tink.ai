"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { auth, db } from "@/firebase/firebase";
import { getUserOnboardingStatus } from "@/actions/user";

export function useGetUserInfo() {
	const [user, setUser] = useState(null);
	const [userDetails, setUserDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isUserOnboarded, setIsUserOnboarded] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			setUser(user);

			if (user) {
				try {
					const userDocRef = doc(db, "users", user.uid);
					const unsubscribeDoc = onSnapshot(userDocRef, (doc) => {
						if (doc.exists()) {
							setUserDetails(doc.data());
						}
					});

					const { isOnboarded } = await getUserOnboardingStatus();

					setIsUserOnboarded(isOnboarded);

					return () => unsubscribeDoc();
				} catch (error) {
					console.error(error);
				}
			} else {
				setUser(null);
				setUserDetails(null);
				router.push("/");
			}

			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	return { user, userDetails, loading, isUserOnboarded };
}
