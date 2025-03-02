import AuthForm from "../../_components/auth-form";

const ForgotPassword = () => {
	return (
		<div className="w-full max-w-sm lg:max-w-5xl bg-black">
			<AuthForm type="forgot-password" />
		</div>
	);
};

export default ForgotPassword;
