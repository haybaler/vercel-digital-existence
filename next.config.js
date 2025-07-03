/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployments
  output: 'standalone',
  
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // Environment variable configuration
  env: {
    DEPLOYMENT_PLATFORM: process.env.DEPLOYMENT_PLATFORM || 'vercel',
  },
  
  // Image optimization for different platforms
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
    ],
  },
}

module.exports = nextConfig