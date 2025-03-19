import React from "react";

import HeaderBox from "./header-box";
import { checkUser } from "@/lib/checkUser";

const HeaderComponent = async () => {
	await checkUser();

	return <HeaderBox />;
};

export default HeaderComponent;
