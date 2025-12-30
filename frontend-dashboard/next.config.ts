import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false, // Disabled for Framer Motion compatibility
    async rewrites() {
        // Use environment variable for backend URL (defaults to localhost for dev)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

        return [
            {
                source: '/api/:path*',
                destination: `${backendUrl}/api/:path*`
            },
            {
                source: '/ws/:path*',
                destination: `${backendUrl}/ws/:path*`
            }
        ];
    },
};

export default nextConfig;
