# Garden Photo Blog

A beautiful and modern photo blog application built with Next.js 15, TypeScript, Tailwind CSS, and Supabase. Features a responsive design, dark mode support, and admin-only content management.

## Features

- 📱 Responsive design that works on all devices
- 🌙 Dark mode support
- 🔒 Admin-only content management
- 📷 Image gallery with modal view
- 🏷️ Tag support for posts
- 🖼️ Drag and drop image uploads
- 🔄 Automated database migrations
- 🛡️ Comprehensive security measures

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Image Storage**: AWS S3 / DreamObjects
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- S3-compatible storage (AWS S3 or DreamObjects)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd garden-photoblog
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables (see Environment Variables section)

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

This project requires several environment variables for Supabase, DreamObjects, and admin configuration.

### DreamObjects Configuration

| Variable Name                   | Description                                              | Public?   |
|---------------------------------|----------------------------------------------------------|-----------|
| `DREAMOBJECTS_ACCESS_KEY`       | DreamObjects S3-compatible access key                    | No        |
| `DREAMOBJECTS_SECRET_KEY`       | DreamObjects S3-compatible secret key                    | No        |
| `DREAMOBJECTS_BUCKET_NAME`      | DreamObjects bucket name for image storage               | No        |

### Supabase Configuration

| Variable Name                   | Description                                              | Public?   |
|---------------------------------|----------------------------------------------------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                                     | Yes       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public API key                             | Yes       |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key for admin operations           | No        |
| `SUPABASE_DATABASE_PASSWORD`    | Supabase database password for development environment   | No        |
| `SUPABASE_PREVIEW_DB_URL`       | Full PostgreSQL connection string for preview database   | No        |
| `SUPABASE_DATABASE_PROD_PASSWORD` | Supabase database password for production environment  | No        |

### Admin Configuration

| Variable Name                   | Description                                              | Public?   |
|---------------------------------|----------------------------------------------------------|-----------|
| `NEXT_PUBLIC_ADMIN_EMAIL`       | Email address for admin access                           | Yes       |

- **Public** variables (with `NEXT_PUBLIC_` prefix) are exposed to browser-side JavaScript.
- **Secret** variables (no `NEXT_PUBLIC_` prefix) are server-side only.

### Setting Environment Variables
- **Vercel:** Add variables in your Vercel project dashboard under Settings → Environment Variables.
- **GitHub Actions:** Add secret variables as repository secrets under Settings → Secrets and variables → Actions.
- **Local Development:** Copy variables into your `.env.local` file (do not commit this file).

## Database Management

### Automated Supabase Migration Workflow

This project uses GitHub Actions to automate Supabase schema migrations for both preview and production databases.

#### How It Works
- **On Pull Request:** 
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev database
  - This ensures your PR is tested against the latest schema changes before merging
- **On push to main:** 
  - All migration files are applied to the production database
  - After successful production deployment, a GitHub Actions job automatically moves all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commits the changes back to `main`
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention

#### Secrets Setup
- Add database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for preview/dev database
  - `SUPABASE_PROD_DB_URL` – for production database

#### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`
- It uses the PostgreSQL client to apply migrations in order, stopping on errors
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed

#### Developer Workflow
1. Add new migration files to `supabase/migrations/`
2. Open a PR to test migrations in preview
3. Merge to `main` to deploy to production
4. Migrations are automatically archived after successful deployment

#### Best Practices
- Test migrations in preview before merging to main
- Never edit production schema directly in the Supabase UI
- Keep secrets secure in GitHub and not in your repo

For implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh`.

## Security Features

This application implements comprehensive security measures:

### CSRF Protection
- CSRF token generation and validation for all state-changing endpoints
- Protected API routes and form submissions

### Content Security Policy (CSP)
- Strict CSP headers with nonce-based script execution
- Configured for both development and production environments

### Authentication
- Supabase authentication with secure cookie handling
- Session validation in middleware
- Admin-only routes protected with email verification

## Image Upload System

The application features a robust image upload system:

1. Browser-side image processing (resizing and compression)
2. EXIF metadata parsing for timestamps while stripping location data for privacy
3. Type-safe image handling using Supabase stored procedures
4. Schema cache consistency between preview and production environments

## Development Environment

### Database Configuration

This project uses a hosted Supabase instance for both development and production:

- **Database URL:** yykxljpswqdjjbnurbwt.supabase.co
- **Development Workflow:**
  - Database changes are managed through SQL migrations in `/supabase/migrations/`
  - Migrations are applied through Supabase Dashboard's SQL Editor
  - No local PostgreSQL instance is used - all development is against the hosted database

### Environment Configuration

- **Production database:** supabase-garden-blog-prod
- **Configuration hierarchy:**
  - Vercel environment variables (highest priority, used in production)
  - .env.production (used for production builds)
  - .env.local (used for local development)
