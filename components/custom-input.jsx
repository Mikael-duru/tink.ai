import React from "react";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const CustomInput = ({ control, name, label, placeholder }) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="form-item">
					<FormLabel className="form-label">{label}</FormLabel>
					<div className="flex w-full flex-col">
						<FormControl>
							<Input
								type={
									name === "password" ||
									name === "currentPassword" ||
									name === "newPassword"
										? "password"
										: "text"
								}
								placeholder={placeholder}
								className="input-class"
								{...field}
							/>
						</FormControl>
						<FormMessage className="form-message mt-2" />
					</div>
				</FormItem>
			)}
		/>
	);
};

export default CustomInput;
