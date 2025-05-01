<!-- 
DOCUMENTATION MANAGEMENT REMINDER:
- Add new entries at the TOP of this file with today's date
- Group changes by type (Features, Bug Fixes, Documentation, etc.)
- Be specific about what was changed and why
- Include PR/issue numbers if applicable
- This CHANGELOG should grow over time by being appended to
- For full documentation guidelines, ask Cascade to "Review the documentation according to our documentation management prompt"
-->

# Changelog

All notable changes to the Garden Photo Blog project will be documented in this file.

## [1.3.1] - 2025-04-30

### Documentation
- Dramatically reduced README size from 16,595 lines to 163 lines by removing duplicate content
- Reorganized environment variables documentation into logical categories (DreamObjects, Supabase, Admin)
- Updated environment variable names and descriptions to match actual usage in the codebase
- Added missing environment variables to documentation (SUPABASE_PREVIEW_DB_URL, SUPABASE_DATABASE_PROD_PASSWORD)
- Updated .env.example to match actual environment variables used in the project
- Standardized CHANGELOG format for better readability and consistency
- Created documentation management process to prevent future README duplication

## [1.3.0] - 2025-04-13

### Added
- EXIF data cleaning for uploaded images to enhance privacy
- Type-safe database schema definitions
- Image insert function for secure file uploads

### Changed
- Enhanced authentication flow with combined cookie-based and service role auth
- Improved error handling across all API endpoints
- Added cascade delete for post-tag relationships

### Security
- Added frame-src CSP headers for Vercel preview environments
- Implemented stricter type checking for image uploads
- Enhanced session validation in middleware

## [1.2.3] - 2025-04-09

### Fixed
- Updated component tests to handle CSRF token validation
- Fixed failing tests in EditPostForm, ImageUpload, and TagManager components
- Improved error handling tests for tag management

## [1.2.2] - 2025-04-08

### Fixed
- Standardized authentication handling across all API endpoints
- Fixed unauthorized access issues in tag management and post editing
- Updated all API routes to use consistent session validation
- Enhanced error messages for better debugging of auth issues

## [1.2.1] - 2025-04-08

### Fixed
- Added missing POST handler for tag creation API endpoint
- Fixed cookie handling in server-side Supabase client

## [1.2.0] - 2025-04-08

### Security
- Added Content Security Policy (CSP) headers
- Implemented rate limiting for API endpoints
- Added CSRF protection for all POST/PUT/DELETE requests
- Enhanced security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Added Strict Transport Security (HSTS) configuration

### Fixed
- Fixed EditPostForm tests to properly handle tag removal and form submission
- Improved error handling tests with proper mock implementations
- Enhanced TagManager error message display and accessibility
- Fixed test synchronization issues with async operations

## [1.1.0] - 2025-04-08

### Added
- Added edit button to posts for admin users
- Created EditPostForm component with form validation
- Implemented secure PUT endpoint for updating posts
- Added modal dialog for editing post content
- Added tag management UI with create, update, and delete functionality
- Implemented secure tag management API routes with admin protection
- Added tag management page to admin dashboard
- Added loading spinner and overlay for image modal

### Changed
- Maintained dark mode support in edit form
- Improved post sorting to dynamically update when dates are modified
- Enhanced FeaturedPost to reflect date changes immediately
- Enhanced server-side authentication with cookie-based session handling
- Improved middleware configuration for better route protection
- Updated navbar with tag management link for admin users

### Fixed
- Fixed date handling to ensure consistent display across components
- Fixed sign-in page redirect for authenticated users

### Performance
- Implemented image preloading for smoother gallery navigation
- Optimized image loading with responsive sizes and blur placeholders

### Accessibility
- Enhanced modal accessibility with larger hit areas and hover effects

## [1.0.1] - 2025-04-07

### Fixed
- Fixed image upload component's browse functionality
- Fixed React hooks ordering in Navbar component

### Changed
- Added proper loading states to auth flow
- Improved sign out behavior with immediate UI updates
- Added post deletion functionality with confirmation dialogs
- Replaced Link with modal for featured posts
- Added admin delete functionality for featured posts
- Increased notes textarea height and improved form UI

## [1.0.0] - 2025-04-07

### Added
- Added featured post component with sorting by timestamp
- Added image preview with drag-and-drop support
- Enhanced sign-in UI with dark mode support

### Changed
- Reorganized auth routes for better security

## [0.1.0] - 2025-04-06

### Added
- Initial project setup with Next.js 14
- Added authentication with Supabase
- Protected admin routes
- Migrated to Supabase with DreamObjects image hosting
- Set up basic client blog application
