import React from "react";
import HeaderBox from "./header-box";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
	await checkUser();

	return <HeaderBox />;
};

export default Header;
