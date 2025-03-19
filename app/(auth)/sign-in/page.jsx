import AuthForm from "../_components/auth-form";

const LoginPage = () => {
	return (
		<div className="w-full max-w-sm lg:max-w-5xl bg-black">
			<AuthForm type="sign-in" />
		</div>
	);
};

export default LoginPage;
