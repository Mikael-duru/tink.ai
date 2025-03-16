"use server";

import HeaderBox from "./header-box";
import { checkUser } from "@/lib/checkUser";
import { cookies } from "next/headers";

const Header = async () => {
	await checkUser();

	const cookieStore = await cookies();
	const authCookie = cookieStore.get("__session")?.value;

	return <HeaderBox authCookie={authCookie} />;
};

export default Header;
