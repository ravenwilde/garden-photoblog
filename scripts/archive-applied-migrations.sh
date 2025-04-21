#!/bin/bash
# Move all .sql migration files from supabase/migrations/ to supabase/migrations/archived/
# Only run this after migrations have been successfully applied in both preview and production.

set -e

MIGRATIONS_DIR="$(dirname "$0")/../supabase/migrations"
ARCHIVE_DIR="$MIGRATIONS_DIR/archived"

mkdir -p "$ARCHIVE_DIR"

for file in "$MIGRATIONS_DIR"/*.sql; do
  # Only move if file exists and is not already archived
  [ -e "$file" ] || continue
  mv "$file" "$ARCHIVE_DIR/"
  echo "Archived $file"
done
