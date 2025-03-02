"use client";

import React, { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetUserInfo } from "@/lib/getUserInfo";
import UserProfile from "./user-profile";
import ChangePassword from "./change-password";

const UserAccount = () => {
	const { user, userDetails } = useGetUserInfo();
	const [activeTab, setActiveTab] = useState("account");

	useEffect(() => {
		const savedTab = localStorage.getItem("activeTab");
		if (savedTab) setActiveTab(savedTab);

		return () => {
			localStorage.removeItem("activeTab");
		};
	}, []);

	// Update localStorage when the tab changes
	const handleTabChange = (value) => {
		setActiveTab(value);
		localStorage.setItem("activeTab", value);
	};

	return (
		<div className="flex flex-col items-center justify-center p-4 gap-6 max-w-[550px] mx-auto">
			<div className="self-start ">
				<h1 className="text-3xl font-bold">My Account</h1>
				<p className="pt-1">Manage your account info.</p>
			</div>
			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				className="w-full"
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="account" className="flex justify-center gap-2">
						Account
					</TabsTrigger>
					<TabsTrigger value="password" className="flex justify-center gap-2">
						Password
					</TabsTrigger>
				</TabsList>
				{/* profile update */}
				<TabsContent value="account">
					<UserProfile user={user} userDetails={userDetails} />
				</TabsContent>
				{/* change password */}
				<TabsContent value="password">
					<ChangePassword />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default UserAccount;
