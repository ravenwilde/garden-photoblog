/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
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
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
