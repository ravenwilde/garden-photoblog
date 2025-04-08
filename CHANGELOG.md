# Changelog

All notable changes to the Garden Photo Blog project will be documented in this file.

## Latest Changes

### Tag Management System (2025-04-08)
- Added tag management UI with create, update, and delete functionality
- Implemented secure tag management API routes with admin protection
- Enhanced server-side authentication with cookie-based session handling
- Added tag management page to admin dashboard
- Improved middleware configuration for better route protection
- Updated navbar with tag management link for admin users

### Image Loading and Modal Improvements (2025-04-08)
- Added loading spinner and overlay for image modal
- Implemented image preloading for smoother gallery navigation
- Enhanced modal accessibility with larger hit areas and hover effects
- Optimized image loading with responsive sizes and blur placeholders
- Fixed sign-in page redirect for authenticated users

### Image Upload and Auth Improvements (2025-04-07)
- Fixed image upload component's browse functionality
- Added proper loading states to auth flow
- Improved sign out behavior with immediate UI updates
- Fixed React hooks ordering in Navbar component

### Post Management and UI Enhancements (2025-04-07)
- Added post deletion functionality with confirmation dialogs
- Replaced Link with modal for featured posts
- Added admin delete functionality for featured posts
- Increased notes textarea height and improved form UI

### Featured Posts and Authentication (2025-04-07)
- Added featured post component with sorting by timestamp
- Reorganized auth routes for better security
- Enhanced sign-in UI with dark mode support
- Added image preview with drag-and-drop support

### Initial Features (2025-04-06)
- Added authentication with Supabase
- Protected admin routes
- Migrated to Supabase with DreamObjects image hosting
- Set up basic client blog application
- Initial project setup with Next.js 14 (2025-04-04)
