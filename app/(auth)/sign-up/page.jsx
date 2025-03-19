import AuthForm from "../_components/auth-form";

const RegisterPage = () => {
	return (
		<div className="w-full max-w-sm lg:max-w-5xl bg-black">
			<AuthForm type="sign-up" />
		</div>
	);
};

export default RegisterPage;
