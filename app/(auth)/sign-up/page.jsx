import AuthForm from "@/components/auth/auth-form";

export default function RegisterPage() {
	return (
		<div className="w-full max-w-sm lg:max-w-5xl bg-black">
			<AuthForm type="sign-up" />
		</div>
	);
}
