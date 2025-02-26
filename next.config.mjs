/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				hostname: "lh3.googleusercontent.com", // Google user profile images
			},
			{
				hostname: "res.cloudinary.com", // Cloudinary images
			},
		],
	},
};

export default nextConfig;
