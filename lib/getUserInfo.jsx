"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { auth, db } from "@/firebase/firebase";

export function useGetUserInfo() {
	const [user, setUser] = useState(null);
	const [userDetails, setUserDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
			if (authUser) {
				setUser(authUser);

				try {
					// Fetch user details from Firestore
					const userDocRef = doc(db, "users", authUser.uid);
					const unsubscribeDoc = onSnapshot(userDocRef, async (doc) => {
						if (doc.exists()) {
							setUserDetails(doc.data());
						} else {
							console.warn("No user details found in Firestore.");
						}
					});

					// Clean up the Firestore listener when the component unmounts
					return () => unsubscribeDoc();
				} catch (error) {
					console.error("Error fetching user details:", error);
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

	return { user, userDetails, loading };
}
