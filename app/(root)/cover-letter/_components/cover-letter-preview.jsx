"use client";

import { useState } from "react";
import {
	Editor,
	EditorProvider,
	Toolbar,
	BtnBold,
	BtnItalic,
	BtnBulletList,
	BtnClearFormatting,
	BtnLink,
	BtnNumberedList,
	BtnRedo,
	BtnUnderline,
	BtnUndo,
	Separator,
} from "react-simple-wysiwyg";

const CoverLetterPreview = ({ content }) => {
	const [value, setValue] = useState(content);
	return (
		<div className="py-4 h-full">
			<EditorProvider>
				<Editor
					value={value}
					onChange={(e) => {
						setValue(e.target.value);
					}}
				>
					<Toolbar>
						<BtnUndo />
						<BtnRedo />
						<Separator />
						<BtnBold />
						<BtnItalic />
						<BtnUnderline />
						<Separator />
						<BtnNumberedList />
						<BtnBulletList />
						<Separator />
						<BtnLink />
						<BtnClearFormatting />
					</Toolbar>
				</Editor>
			</EditorProvider>
		</div>
	);
};

export default CoverLetterPreview;
