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
      // Phase 1 route consolidations — all old routes redirect to closest new equivalent
      { source: '/command-center', destination: '/neighbourhood', permanent: false },
      { source: '/renewable-forecast', destination: '/neighbourhood', permanent: false },
      { source: '/demand-forecast', destination: '/neighbourhood', permanent: false },
      { source: '/resilience', destination: '/neighbourhood', permanent: false },
      { source: '/flexibility', destination: '/digital-twin', permanent: false },
      { source: '/storage', destination: '/digital-twin', permanent: false },
      { source: '/p2p', destination: '/affordability', permanent: false },
      { source: '/explainable-ai', destination: '/validation', permanent: false },
      { source: '/architecture', destination: '/validation', permanent: false },
      { source: '/about', destination: '/validation', permanent: false },
      { source: '/sky-vision', destination: '/neighbourhood', permanent: false },
      { source: '/self-healing', destination: '/discom', permanent: false },
      { source: '/spatial-twin', destination: '/digital-twin', permanent: false },
      { source: '/tariff-engine', destination: '/affordability', permanent: false },
      { source: '/incident-copilot', destination: '/', permanent: false },
      { source: '/copilot', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
