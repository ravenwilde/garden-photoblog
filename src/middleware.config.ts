export const config = {
  matcher: [
    '/api/:path*',  // Apply middleware to all API routes
    '/white-rabbit/:path*'  // Apply middleware to admin routes
  ]
};
