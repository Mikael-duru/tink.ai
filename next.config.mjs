/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com", // Google user profile images
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com", // Cloudinary images
			},
			{
				protocol: "https",
				hostname: "randomuser.me", // Cloudinary images
			},
		],
	},
};

export default nextConfig;
