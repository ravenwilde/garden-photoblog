/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['127.0.0.1:50269', '127.0.0.1:3000']
    }
  },
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

// Log environment mode
if (process.env.NODE_ENV === 'production') {
  console.log('🚀 Running in production mode')
} else {
  console.log('🛠️ Running in development mode')
}

module.exports = nextConfig
