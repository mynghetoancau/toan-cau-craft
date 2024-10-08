/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Dấu ** cho phép tất cả các tên miền
            },
        ],
    },
};

export default nextConfig;
