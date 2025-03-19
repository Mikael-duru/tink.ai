"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import CustomInput from "../../../components/custom-input";
import { auth, db } from "@/firebase/firebase";
import SignInWithGoogle from "./google-login";
import { storeUser } from "@/lib/cookieStore";
import { getUserOnboardingStatus } from "@/actions/user";

const formSchema = (type) =>
	z.object({
		// sign up only
		firstName:
			type === "sign-in" || type === "forgot-password"
				? z.string().optional()
				: z.string().min(3, {
						message: "First name is required.",
				  }),
		lastName:
			type === "sign-in" || type === "forgot-password"
				? z.string().optional()
				: z.string().min(3, {
						message: "Last name is required.",
				  }),

		// both sign up snd sign in
		email: z.string().email(),
		password:
			type === "forgot-password"
				? z.string().optional()
				: z.string().min(6, {
						message:
							type === "sign-in"
								? "Please enter your password (must contain at least 6 characters)."
								: "Password is required (must contain at least 6 characters).",
				  }),
	});

const AuthForm = ({ type }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const authFormSchema = formSchema(type);

	const form = useForm({
		resolver: zodResolver(authFormSchema),
		defaultValues: {
			email: "",
			password: "",
			firstName: "",
			lastName: "",
		},
	});

	const onSubmit = async (data) => {
		try {
			setIsLoading(true);
			const { email, password, firstName, lastName } = data;

			// Register user
			if (type === "sign-up") {
				const { user } = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);

				const userData = {
					email,
					firstName,
					lastName,
					id: user.uid,
					photoURL: "",
					displayName: `${firstName} ${lastName}`,
					imgPublicId: "", //From cloudinary
				};

				await setDoc(doc(db, "users", user.uid), userData);

				// Temporary store user data in local storage
				localStorage.setItem(
					"registrationData",
					JSON.stringify({
						userData,
					})
				);

				await signOut(auth);

				router.push("/sign-in");
			}

			// Authenticate user
			if (type === "sign-in") {
				// Authenticate user
				const userCredential = await signInWithEmailAndPassword(
					auth,
					email,
					password
				);

				const user = userCredential.user;

				// Check if user document already exists in Firestore
				const userDoc = await getDoc(doc(db, "users", user.uid));

				if (!userDoc.exists()) {
					const userRegistrationData = JSON.parse(
						localStorage.getItem("registrationData")
					);
					await setDoc(doc(db, "users", user.uid), userRegistrationData);
				}
				localStorage.removeItem("registrationData");

				// Store userId in cookies
				await storeUser({ idToken: user.uid });

				// Redirect to onboarding if the user is not already onboarded
				const { isOnboarded } = await getUserOnboardingStatus();

				if (!isOnboarded) {
					router.push("/onboarding");
				} else {
					router.push("/");
				}
			}

			// Send password reset link
			if (type === "forgot-password") {
				// Send password reset email
				await sendPasswordResetEmail(auth, email);
				toast.success(
					`Request Successful! \n If an account exists for ${email}, you'll receive instructions.`
				);
			}
		} catch (error) {
			let errorMessage;
			switch (error.code) {
				case "auth/user-not-found":
					errorMessage = "No user found with this email.";
					break;
				case "auth/wrong-password":
					errorMessage = "Incorrect password.";
					break;
				case "auth/invalid-email":
					errorMessage = "Invalid email address.";
					break;
				case "auth/email-already-in-use":
					errorMessage = "The email is already in use.";
					break;
				case "auth/invalid-credential":
					errorMessage = "Invalid credentials";
					break;
				case "auth/credential-already-in-use":
					errorMessage =
						"This credential is already associated with a different user account.";
					break;
				default:
					errorMessage = "An error occurred. Please try again.";
			}
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="overflow-hidden">
			<CardContent className="grid p-0 lg:grid-cols-2">
				<div className="p-6 md:p-8 flex items-center justify-center">
					<div className="flex flex-col gap-6 w-full">
						<div className="flex flex-col items-center gap-2 text-center">
							<h1 className="text-2xl font-bold">
								{type === "sign-in"
									? "Sign in to Tink.ai"
									: type === "sign-up"
									? "Create your account"
									: "Forgot Password"}
							</h1>
							<p className="text-sm text-muted-foreground">
								{type === "sign-in"
									? "Welcome back! Please sign in to continue."
									: type === "sign-up"
									? "Welcome! Please fill in the details to get started."
									: "Please fill in your email for password reset link."}
							</p>
						</div>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								{/* SIGN UP */}
								{type === "sign-up" && (
									<>
										<div className="flex max-lg:flex-col gap-6 lg:gap-5">
											{/* First name */}
											<CustomInput
												control={form.control}
												name="firstName"
												label="First Name"
												placeholder="Enter your first name"
											/>

											{/* Last name */}
											<CustomInput
												control={form.control}
												name="lastName"
												label="Last Name"
												placeholder="Enter your last name"
											/>
										</div>
									</>
								)}

								{/* SIGN IN */}
								{/* email field */}
								<CustomInput
									control={form.control}
									name="email"
									label="Email"
									placeholder="Enter your email"
								/>

								{/* Password field */}
								{type !== "forgot-password" && (
									<div>
										<CustomInput
											control={form.control}
											name="password"
											label="Password"
											placeholder="Enter your password"
										/>
										{type === "sign-in" && (
											<div className="text-end pt-1">
												<Link
													href="/sign-in/forgot-password"
													className="text-end text-sm underline-offset-4 hover:underline"
												>
													Forgot your password?
												</Link>
											</div>
										)}
									</div>
								)}

								<div className="w-full">
									<Button type="submit" className="w-full" disabled={isLoading}>
										{isLoading ? (
											<>
												<Loader2 size={20} className="animate-spin" />{" "}
												&nbsp;Loading...
											</>
										) : type === "sign-in" ? (
											"Sign In"
										) : type === "sign-up" ? (
											"Sign Up"
										) : (
											"Send Reset Link"
										)}
									</Button>
								</div>
							</form>
						</Form>

						{type === "sign-in" && <SignInWithGoogle />}

						{type !== "forgot-password" && (
							<footer className="flex justify-center gap-1 text-center">
								<p className="text-sm font-normal">
									{type === "sign-in"
										? "Don't have an account?"
										: "Already have an account?"}
								</p>
								<Link
									href={type === "sign-in" ? "/sign-up" : "/sign-in"}
									className="text-sm underline underline-offset-4"
								>
									{type === "sign-in" ? "Sign Up" : "Sign In"}
								</Link>
							</footer>
						)}
					</div>
				</div>
				<div className="relative hidden bg-muted lg:block h-[560px]">
					<Image
						src="/assets/ai-career-coach.png"
						width={900}
						height={560}
						alt="Banner image"
						className="absolute inset-0 h-[560px] w-auto object-cover object-center"
						priority
					/>
				</div>
			</CardContent>
		</Card>
	);
};

export default AuthForm;
