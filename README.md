# Garden Photo Blog

A beautiful and modern photo blog application built with Next.js, Tailwind CSS, and Supabase. Features a responsive design, dark mode support, and admin-only content management.

## Features

- 📱 Responsive design that works on all devices
- 🌓 Dark mode support with smooth transitions
- 🖼️ Image gallery with modal view and navigation
- 🔒 Secure admin authentication
- ✨ Featured post showcase
- 📝 Simple post creation and management
- 🏷️ Tag support for better organization
- 🎯 Drag and drop image uploads

## Changelog

Latest changes at the top:

### Image Upload and Auth Improvements
- Fixed image upload component's browse functionality
- Added proper loading states to auth flow
- Improved sign out behavior with immediate UI updates
- Fixed React hooks ordering in Navbar component

### Post Management and UI Enhancements
- Added post deletion functionality with confirmation dialogs
- Replaced Link with modal for featured posts
- Added admin delete functionality for featured posts
- Increased notes textarea height and improved form UI

### Featured Posts and Authentication
- Added featured post component with sorting by timestamp
- Reorganized auth routes for better security
- Enhanced sign-in UI with dark mode support
- Added image preview with drag-and-drop support

### Initial Features
- Added authentication with Supabase
- Protected admin routes
- Migrated to Supabase with DreamObjects image hosting
- Set up basic client blog application
- Initial project setup with Next.js 14

## Getting Started

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd garden-photoblog
npm install
```

2. Set up your environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication

The blog uses a single admin user system. To access admin features:

1. Navigate to `/white-rabbit` (obfuscated sign-in route)
2. Sign in with your admin credentials
3. Admin features will be available:
   - Post creation at `/new`
   - Post deletion
   - Image uploads

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Database**: [Supabase](https://supabase.com)
- **Icons**: [Heroicons](https://heroicons.com)
- **Deployment**: [Vercel](https://vercel.com)

## Development

- Uses the Next.js App Router
- Server components for better performance
- Client-side auth state management
- Responsive images with next/image
- Dark mode with next-themes

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Make sure to add your environment variables in the Vercel dashboard.
