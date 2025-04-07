/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.objects-us-east-1.dream.io',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
