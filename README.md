# Garden Photo Blog

## Environment Variables

This project requires several environment variables for Supabase, S3/DreamObjects, and admin configuration. These must be set in your Vercel project settings and/or as GitHub Actions secrets for CI/CD and local development.

| Variable Name                   | Description                                              | Public?   |
|---------------------------------|----------------------------------------------------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL (public API endpoint)               | Yes       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public API key (browser-safe)              | Yes       |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role/admin API key (server only)        | No        |
| `SUPABASE_DATABASE_PASSWORD`    | Supabase database password (for migrations/CI, server)   | No        |
| `DREAMOBJECTS_ACCESS_KEY`       | S3/DreamObjects access key (server only)                 | No        |
| `DREAMOBJECTS_SECRET_KEY`       | S3/DreamObjects secret key (server only)                 | No        |
| `DREAMOBJECTS_BUCKET_NAME`      | S3/DreamObjects bucket name                              | No        |
| `NEXT_PUBLIC_ADMIN_EMAIL`       | Email address for admin access (browser-safe)            | Yes       |

- **Public** variables (with `NEXT_PUBLIC_` prefix) are exposed to browser-side JavaScript and should not contain secrets.
- **Secret** variables (no `NEXT_PUBLIC_` prefix) must never be exposed to the client and should only be available server-side.

### Setting Environment Variables
- **Vercel:** Add all variables above in your Vercel project dashboard under Settings → Environment Variables. Set for both Production and Preview environments as needed.
- **GitHub Actions:** Add all secret variables used for migrations and deploys as repository secrets under Settings → Secrets and variables → Actions.
- **Local Development:** Copy these variables into your `.env.local` file (do not commit this file).

---

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

A beautiful and modern photo blog application built with Next.js, Tailwind CSS, and Supabase. Features a responsive design, dark mode support, and admin-only content management.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

## Features

- 📸 **Secure and Smart Image Uploads**: Images are resized and compressed client-side, with EXIF data parsed to extract the original timestamp (if available) and all personally identifying EXIF metadata (such as geolocation) stripped before upload.
- 🕒 **Consistent Timestamps and Schema**: The database schema includes an `updated_at` column for images, and all image insertions use the `insert_images` stored procedure and the `image_insert_data` custom type for robust timestamp management and type safety. This ensures schema cache consistency between preview and production environments.
- 🗂️ **Type-Safe Image Handling**: The upload API leverages the new Supabase function for all image insertions, enforcing correct types and consistent timestamp handling.

---

## Image Uploads

Image uploads are handled through a drag-and-drop interface. When an image is selected:

1. The image is resized and compressed in the browser for optimal storage and performance.
2. EXIF metadata is parsed to extract the original timestamp (if present), which is used to set the `timestampTaken` field for the image. All other EXIF data, including geolocation, is stripped for privacy.
3. The upload API calls a Supabase stored procedure (`insert_images`) using the custom `image_insert_data` type, which ensures:
   - The `updated_at` column is set correctly.
   - Type safety and schema cache consistency between preview and production databases.
4. Images are stored in AWS S3 (DreamObjects), and references are saved in the Supabase database.

**Note:** These changes were made to resolve schema cache issues and improve the privacy and reliability of image uploads. See the migrations in `supabase/migrations/` for implementation details.

---

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- 📱 Responsive design that works on all devices

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- 🌓 Dark mode support with smooth transitions

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- 🖼️ Image gallery with modal view and navigation

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- 🔒 Secure admin authentication

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- ✨ Featured post showcase

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- 📝 Simple post creation and management

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- 🏷️ Tag support for better organization

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- 🎯 Drag and drop image uploads

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

## Latest Updates

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

See our [CHANGELOG](CHANGELOG.md) for a detailed history of changes.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

## Getting Started

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

1. Clone the repository and install dependencies:

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

```bash

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

git clone <repository-url>

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

cd garden-photoblog

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

npm install

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

```

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

2. Set up your environment variables by copying the example file:

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

```bash

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

cp .env.example .env.local

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

```

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

3. Update the environment variables in `.env.local` with your credentials:

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

```env

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

NEXT_PUBLIC_S3_ENDPOINT=your_s3_endpoint

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

NEXT_PUBLIC_S3_BUCKET=your_s3_bucket

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

NEXT_PUBLIC_S3_ACCESS_KEY_ID=your_s3_access_key_id

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

NEXT_PUBLIC_S3_SECRET_ACCESS_KEY=your_s3_secret_access_key

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

```

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

4. Run the development server:

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

```bash

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

npm run dev

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

```

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

## Deployment

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

This project is configured for deployment on Vercel. Follow these steps to deploy:

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

2. Import your repository on [Vercel](https://vercel.com)

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

3. Configure the following environment variables in your Vercel project settings:

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

   - `NEXT_PUBLIC_SUPABASE_URL`

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

   - `NEXT_PUBLIC_ADMIN_EMAIL`

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

   - `NEXT_PUBLIC_S3_ENDPOINT`

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

   - `NEXT_PUBLIC_S3_BUCKET`

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

   - `NEXT_PUBLIC_S3_ACCESS_KEY_ID`

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

   - `NEXT_PUBLIC_S3_SECRET_ACCESS_KEY`

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

4. Deploy! Vercel will automatically build and deploy your site.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

### Custom Domain

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

To use a custom domain:

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

1. Go to your project settings in Vercel

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

2. Navigate to the 'Domains' section

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

3. Add your domain and follow the DNS configuration instructions

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

npm install

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

```

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

2. Set up your environment variables in `.env.local`:

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

```env

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

```

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

3. Run the development server:

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

```bash

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

npm run dev

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

```

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

## Authentication

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

The blog uses a single admin user system. To access admin features:

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

1. Navigate to `/white-rabbit` (obfuscated sign-in route)

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

2. Sign in with your admin credentials

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

3. Admin features will be available:

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

   - Post creation at `/new`

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

   - Post deletion

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

   - Image uploads

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

## Tech Stack

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- **Framework**: [Next.js 14](https://nextjs.org)

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- **Styling**: [Tailwind CSS](https://tailwindcss.com)

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- **Authentication**: [Supabase Auth](https://supabase.com/auth)

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- **Database**: [Supabase](https://supabase.com)

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- **Icons**: [Heroicons](https://heroicons.com)

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- **Deployment**: [Vercel](https://vercel.com)

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

## Development

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Uses the Next.js App Router

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Server components for better performance

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Client-side auth state management

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Responsive images with next/image

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Dark mode with next-themes

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

## Deployment

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

Make sure to add your environment variables in the Vercel dashboard.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

---

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

## Supabase Schema Change Workflow

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

**Safely update your database schema using migrations and best practices.**

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

### 1. Plan Your Schema Changes

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Decide what changes you need (tables, columns, constraints, etc.).

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Document and communicate with your team.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

### 2. Create a Migration File

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Create a new SQL file in `supabase/migrations/`, e.g. `supabase/migrations/YYYYMMDD_your_change.sql`.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Write your SQL statements for the schema change in this file.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

### 3. Apply the Migration to the Preview/Dev Database

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Use the `psql` command with the **pooler connection string** for your preview/dev database:

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

  ```sh

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

  psql "postgres://postgres.<preview_project_ref>:<preview_password>@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/<your_migration_file>.sql

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

  ```

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Example:

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

  ```sh

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

  psql "postgres://postgres.yykxljpswqdjjbnurbwt:ka2RdKSkWhKmAMaJ@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/20250418_add_new_feature.sql

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

  ```

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

### 4. Test Your Application

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Verify the schema changes work as expected in the preview/dev environment.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Run your app and automated tests.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

### 5. Commit the Migration File to Git

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

```sh

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

git add supabase/migrations/YYYYMMDD_your_change.sql

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

git commit -m "Add migration for <describe your change>"

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

git push origin <your-feature-branch>

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

```

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

### 6. Open a Pull Request

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Open a PR from your feature branch to `main`.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Request code review. CI/CD should run tests against the updated schema in preview/dev.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

### 7. Merge to Main

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Once approved and tested, merge the PR into `main`.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- The migration file is now part of your main branch and ready for production.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

### 8. Apply the Migration to Production

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Use the `psql` command with the **production pooler connection string**:

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

  ```sh

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

  psql "postgres://postgres.<prod_project_ref>:<prod_password>@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/YYYYMMDD_your_change.sql

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

  ```

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Example:

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

  ```sh

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

  psql "postgres://postgres.bhexvgiygtfizaffarjh:F159kfRcC3qTUbPx@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/20250418_add_new_feature.sql

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

  ```

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

### Best Practices

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Never edit production schema directly in the Supabase UI.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Always use migration files and version control.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Test every migration in preview/dev before production.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Keep credentials secure and never commit them to your repo.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

- Document each migration and its purpose in the file and PR.

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.



## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

---

## Automated Supabase Migration Workflow (CI/CD)

This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases, and to automatically archive applied migrations.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - **After successful production deployment, a GitHub Actions job will automatically move all applied `.sql` migration files from `supabase/migrations/` to `supabase/migrations/archived/` and commit the changes back to `main`.**
  - This keeps the migrations folder clean and ensures migrations are version-controlled and archived without manual intervention.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.
- Archiving is handled by `scripts/archive-applied-migrations.sh`, which is run automatically by the workflow after production migrations succeed.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`
    - Runs the archive script to move applied migrations to `archived/` and commits the changes

### Developer Workflow
- Add new migration files to `supabase/migrations/` as needed.
- Open a PR to test migrations in preview/dev.
- Merge to `main` to deploy to production.
- **You do not need to manually move or delete migration files after deployment—this is now fully automated!**

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` and `scripts/archive-applied-migrations.sh` in this repository.


This project uses **GitHub Actions** to automate applying Supabase schema migrations to both preview (dev) and production databases.

### How It Works
- **On every Pull Request (PR):**
  - All migration files in `supabase/migrations/` are automatically applied to the preview/dev Supabase database.
  - This ensures your PR is tested against the latest schema changes before merging.
- **On every push to `main`:**
  - All migration files are applied to the production Supabase database.
  - This keeps production in sync with your main branch and ensures migrations are version-controlled.

### Secrets Setup
- Add your database connection strings as GitHub Actions secrets:
  - `SUPABASE_PREVIEW_DB_URL` – for the preview/dev database
  - `SUPABASE_PROD_DB_URL` – for the production database

### Workflow File
- The automation is defined in `.github/workflows/supabase-migrate.yml`.
- It uses the PostgreSQL client to apply migrations in order, stopping on errors.

### Example Workflow Steps
1. **On PR (preview):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to preview DB using `$SUPABASE_PREVIEW_DB_URL`
2. **On main (production):**
    - Checks out code
    - Installs PostgreSQL client
    - Applies migrations to production DB using `$SUPABASE_PROD_DB_URL`

### Best Practices
- Always test migrations in preview/dev (via PR) before merging to main.
- Never edit production schema directly in the Supabase UI—always use migrations.
- Keep secrets secure in GitHub and do not commit them to your repo.

For full implementation details, see `.github/workflows/supabase-migrate.yml` in this repository.

