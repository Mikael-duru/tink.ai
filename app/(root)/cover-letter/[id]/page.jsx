const AICoverLetter = async ({ params }) => {
	const { id } = await params;

	return <div>CoverLetter: {id}</div>;
};

export default AICoverLetter;
