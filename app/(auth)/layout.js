import React from "react";

const AuthLayout = ({ children }) => {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center px-6 py-12 ">
			{children}
		</div>
	);
};

export default AuthLayout;
