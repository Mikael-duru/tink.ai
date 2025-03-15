"use client";

import {
	deleteUser,
	EmailAuthProvider,
	GoogleAuthProvider,
	reauthenticateWithCredential,
	reauthenticateWithPopup,
} from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, UserRoundCheck, Eye, EyeOff } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, db } from "@/firebase/firebase";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProfileImageUpload from "./image-upload";
import { Button } from "@/components/ui/button";

const UserProfile = ({ user, userDetails }) => {
	const [password, setPassword] = useState("");
	const [deleteAccount, setDeleteAccount] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [passwordError, setPasswordError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const currentUser = auth?.currentUser;

	const isEmailUser =
		currentUser?.providerData.some(
			(provider) => provider.providerId === "password"
		) || false;

	const isGoogleUser =
		currentUser?.providerData.some(
			(provider) => provider.providerId === "google.com"
		) || false;

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
		setPasswordError(""); // Clear error when user starts typing
	};

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	const handleDeleteUserAccount = async () => {
		try {
			setIsLoading(true);

			// Ensure password is entered for email users
			if (isEmailUser && !password) {
				setPasswordError("Password is required");
				setIsLoading(false);
				return;
			}

			// Reauthenticate user
			if (isEmailUser) {
				try {
					const email = currentUser.email;
					const credential = EmailAuthProvider.credential(email, password);
					await reauthenticateWithCredential(currentUser, credential);
				} catch (error) {
					if (
						error.code === "auth/wrong-password" ||
						error.code === "auth/invalid-credential"
					) {
						setPasswordError("Incorrect password. Please try again.");
					} else {
						toast.error("Reauthentication failed. Please try again.");
					}
					setIsLoading(false);
					return;
				}
			}

			if (isGoogleUser) {
				try {
					const googleProvider = new GoogleAuthProvider();
					await reauthenticateWithPopup(currentUser, googleProvider);
				} catch (error) {
					toast.error("Reauthentication failed. Please try again.");
					setIsLoading(false);
					return;
				}
			}

			// Proceed with deleting the user account
			const userDocRef = doc(db, "users", currentUser.uid);
			await deleteDoc(userDocRef);
			await deleteUser(currentUser);

			toast.success("Account deleted successfully!");
			router.push("/");
		} catch (error) {
			console.error("[Delete_Account]", error);
			toast.error("Something went wrong. Please try again.");
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardContent className="space-y-8 pt-6">
				<Card>
					<CardContent className="space-y-4 max-sm:px-4">
						<div className="pt-6 sm:flex justify-between max-sm:text-center">
							<div>
								<Avatar className="h-24 w-24 border-2 border-primary/20 max-sm:mx-auto">
									<AvatarImage
										src={userDetails?.photoURL}
										alt="user profile pic"
									/>
									<AvatarFallback>
										<UserRoundCheck size={50} />
									</AvatarFallback>
								</Avatar>
								<div className="pt-2">
									<h1 className="gradient-title text-2xl -mb-2">
										{userDetails?.displayName}
									</h1>
									<p className="text-sm sm:text-base text-muted-foreground">
										{userDetails?.email}
									</p>
								</div>
							</div>
							<ProfileImageUpload user={user} userDetails={userDetails} />
						</div>
					</CardContent>
				</Card>

				<Card className="border-red-900">
					<CardHeader>
						<CardTitle className="gradient-title text-3xl">
							Delete Account
						</CardTitle>
						<CardDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our server.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isEmailUser && (
							<div className="space-y-1 pb-8">
								<Label
									htmlFor="password"
									className={`${passwordError ? "text-red-500" : ""}`}
								>
									Password
								</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										onChange={handlePasswordChange}
										className={`${passwordError ? "border-red-500" : ""} pr-10`}
										value={password}
									/>
									<button
										type="button"
										onClick={togglePasswordVisibility}
										className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>
								{passwordError && (
									<p className="text-red-500 text-xs">{passwordError}</p>
								)}
							</div>
						)}

						<div className="space-y-1">
							<Label htmlFor="deleteAcct">
								Type the word <span className="text-red-500">"delete"</span> to
								confirm.
							</Label>
							<Input
								id="deleteAcct"
								placeholder='Enter the word "delete"'
								onChange={(e) => setDeleteAccount(e.target.value)}
								value={deleteAccount}
							/>
						</div>
					</CardContent>
					<CardFooter>
						<div className="w-full flex justify-end">
							<Button
								onClick={handleDeleteUserAccount}
								variant="destructive"
								disabled={deleteAccount !== "delete" || isLoading}
							>
								{isLoading ? (
									<Loader2 size={20} className="animate-spin" />
								) : (
									"Confirm"
								)}
							</Button>
						</div>
					</CardFooter>
				</Card>
			</CardContent>
		</Card>
	);
};

export default UserProfile;
