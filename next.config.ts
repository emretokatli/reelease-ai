import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path((?!uploads(?:/|$)).*)',
        destination: 'http://localhost:3000/api/:path',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '::1',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    localPatterns: [
      {
        pathname: '/api/uploads/**',
        search: '',
      },
      {
        pathname: '/images/**',
        search: '',
      },
      {
        pathname: '/uploads/**',
        search: '',
      }
    ],
  },
  // redirects: async () => {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/',
  //       permanent: true,
  //     },
  //   ]
  // },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
    proxyClientMaxBodySize: '100mb',
  },
}

export default nextConfig
