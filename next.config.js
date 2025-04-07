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
        hostname: 'garden-blog.s3.us-east-005.dream.io',
        pathname: '/images/**',
      },
    ],
  },
}

module.exports = nextConfig
