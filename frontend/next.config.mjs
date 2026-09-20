/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Environment Variables
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  },

  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8008';
    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      // Redirects will be enabled as new consolidated routes are built in Phases 2 and 3
    ];
  },
};

export default nextConfig;
