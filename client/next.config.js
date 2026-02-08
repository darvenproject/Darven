/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages compatibility
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // CRITICAL: Disable image optimization for Cloudflare Pages
    unoptimized: true,
    
    remotePatterns: [
      // Production - backend uploads
      {
        protocol: 'https',
        hostname: 'api.shopdarven.pk',
        pathname: '/uploads/**',
      },
      // Production - frontend placeholders
      {
        protocol: 'https',
        hostname: 'shopdarven.pk',
        pathname: '/**',
      },
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/uploads/**',
      },
    ],
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
}

module.exports = nextConfig