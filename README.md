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

### April 7, 2025
- Fixed image upload component's browse functionality
- Improved sign out behavior with immediate UI updates
- Fixed React hooks ordering in Navbar component
- Added proper loading states during auth changes

### April 6, 2025
- Added post deletion functionality
- Implemented delete confirmation dialogs
- Added delete button to featured posts
- Fixed featured post interactions to use ImageModal

### April 5, 2025
- Simplified post creation by removing rich text editor
- Updated post form to use simple textarea
- Fixed auth context implementation
- Added proper error handling for sign-in

### April 4, 2025
- Added featured post component
- Implemented image modal with navigation
- Added dark mode support
- Created responsive navigation system

### April 3, 2025
- Initial project setup with Next.js 14
- Added Supabase integration for auth and storage
- Implemented basic post creation
- Added image upload functionality

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
