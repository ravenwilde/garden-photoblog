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

2. Set up your environment variables by copying the example file:

```bash
cp .env.example .env.local
```

3. Update the environment variables in `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email
NEXT_PUBLIC_S3_ENDPOINT=your_s3_endpoint
NEXT_PUBLIC_S3_BUCKET=your_s3_bucket
NEXT_PUBLIC_S3_ACCESS_KEY_ID=your_s3_access_key_id
NEXT_PUBLIC_S3_SECRET_ACCESS_KEY=your_s3_secret_access_key
```

4. Run the development server:

```bash
npm run dev
```

## Deployment

This project is configured for deployment on Vercel. Follow these steps to deploy:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your repository on [Vercel](https://vercel.com)

3. Configure the following environment variables in your Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_EMAIL`
   - `NEXT_PUBLIC_S3_ENDPOINT`
   - `NEXT_PUBLIC_S3_BUCKET`
   - `NEXT_PUBLIC_S3_ACCESS_KEY_ID`
   - `NEXT_PUBLIC_S3_SECRET_ACCESS_KEY`

4. Deploy! Vercel will automatically build and deploy your site.

### Custom Domain

To use a custom domain:

1. Go to your project settings in Vercel
2. Navigate to the 'Domains' section
3. Add your domain and follow the DNS configuration instructions
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
