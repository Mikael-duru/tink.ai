import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
	const [data, setData] = useState(undefined);
	const [isLoading, setIsLoading] = useState(null);
	const [error, setError] = useState(null);

	const fn = async (...args) => {
		try {
			setIsLoading(true);
			setError(null);
			const res = await cb(...args);
			setData(res);
		} catch (error) {
			setError(error);
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return { data, setData, isLoading, error, fn };
};

export default useFetch;
