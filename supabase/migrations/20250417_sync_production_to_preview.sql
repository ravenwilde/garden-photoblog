-- 1. Enable required extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA pgsodium;

-- 2. Add supabase_migrations schema and table (if you use Supabase migration tracking)
CREATE SCHEMA IF NOT EXISTS supabase_migrations;

CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
    version text NOT NULL PRIMARY KEY,
    statements text[],
    name text
);

-- 3. Add missing columns to tags table
ALTER TABLE public.tags
  ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now() NOT NULL,
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now() NOT NULL;

-- 4. Set DEFAULT now() for created_at/updated_at columns in images, posts, post_tags
ALTER TABLE public.images
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET DEFAULT now();

ALTER TABLE public.posts
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET DEFAULT now();

ALTER TABLE public.post_tags
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET DEFAULT now();

-- 5. Standardize UUID default to gen_random_uuid()
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_attrdef
    WHERE adsrc LIKE '%extensions.uuid_generate_v4()%'
      AND adrelid = 'public.images'::regclass
      AND adnum = (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.images'::regclass AND attname = 'id')
  ) THEN
    ALTER TABLE public.images ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_attrdef
    WHERE adsrc LIKE '%extensions.uuid_generate_v4()%'
      AND adrelid = 'public.posts'::regclass
      AND adnum = (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.posts'::regclass AND attname = 'id')
  ) THEN
    ALTER TABLE public.posts ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_attrdef
    WHERE adsrc LIKE '%extensions.uuid_generate_v4()%'
      AND adrelid = 'public.tags'::regclass
      AND adnum = (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.tags'::regclass AND attname = 'id')
  ) THEN
    ALTER TABLE public.tags ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
END
$$;

-- 6. Add missing indexes
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON public.post_tags (post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON public.post_tags (tag_id);
CREATE INDEX IF NOT EXISTS idx_posts_date ON public.posts (date DESC);
CREATE INDEX IF NOT EXISTS idx_tags_name ON public.tags (name);

-- 7. Add missing triggers
-- Ensure the trigger function exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to posts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_posts_updated_at'
  ) THEN
    CREATE TRIGGER update_posts_updated_at
      BEFORE UPDATE ON public.posts
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END
$$;

-- 8. Fix foreign keys in post_tags to have ON DELETE CASCADE
ALTER TABLE public.post_tags
  DROP CONSTRAINT IF EXISTS post_tags_post_id_fkey,
  ADD CONSTRAINT post_tags_post_id_fkey
    FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE public.post_tags
  DROP CONSTRAINT IF EXISTS post_tags_tag_id_fkey,
  ADD CONSTRAINT post_tags_tag_id_fkey
    FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;

-- 9. (Optional) Add vault functions/views if you use them
-- (Uncomment if you use Supabase Vault)
-- CREATE FUNCTION vault.secrets_encrypt_secret_secret() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
--               BEGIN
--                       new.secret = CASE WHEN new.secret IS NULL THEN NULL ELSE
--                       CASE WHEN new.key_id IS NULL THEN NULL ELSE pg_catalog.encode(
--                         pgsodium.crypto_aead_det_encrypt(
--                               pg_catalog.convert_to(new.secret, 'utf8'),
--                               pg_catalog.convert_to((new.id::text || new.description::text || new.created_at::text || new.updated_at::text)::text, 'utf8'),
--                               new.key_id::uuid,
--                               new.nonce
--                         ),
--                               'base64') END END;
--               RETURN new;
--               END;
--               $$;

-- CREATE VIEW vault.decrypted_secrets AS
--  SELECT secrets.id,
--     secrets.name,
--     secrets.description,
--     secrets.secret,
--         CASE
--             WHEN (secrets.secret IS NULL) THEN NULL::text
--             ELSE
--             CASE
--                 WHEN (secrets.key_id IS NULL) THEN NULL::text
--                 ELSE convert_from(pgsodium.crypto_aead_det_decrypt(decode(secrets.secret, 'base64'::text), convert_to(((((secrets.id)::text || secrets.description) || (secrets.created_at)::text) || (secrets.updated_at)::text), 'utf8'::name), secrets.key_id, secrets.nonce), 'utf8'::name)
--             END
--         END AS decrypted_secret,
--     secrets.key_id,
--     secrets.nonce,
--     secrets.created_at,
--     secrets.updated_at
--    FROM vault.secrets;

-- 10. Add or update comments, extensions, and any other differences as needed.

-- END OF MIGRATION