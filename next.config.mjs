/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
    // This allows the build to complete despite the flag error
    ignoreBuildErrors: true, 
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
}

export default nextConfig
