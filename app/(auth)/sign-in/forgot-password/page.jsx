import AuthForm from "@/components/auth/auth-form";
import React from "react";

const ForgotPassword = () => {
	return (
		<div className="w-full max-w-sm lg:max-w-5xl bg-black">
			<AuthForm type="forgot-password" />
		</div>
	);
};

export default ForgotPassword;
