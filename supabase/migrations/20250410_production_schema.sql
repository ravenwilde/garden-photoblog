-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create essential schemas
CREATE SCHEMA IF NOT EXISTS public;

-- Create tables
CREATE TABLE IF NOT EXISTS public.posts (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text NOT NULL,
    notes text,
    date date NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.images (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    post_id uuid NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL,
    alt text NOT NULL,
    url text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES public.posts(id)
);

CREATE TABLE IF NOT EXISTS public.tags (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS public.post_tags (
    post_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES public.posts(id),
    FOREIGN KEY (tag_id) REFERENCES public.tags(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_date ON public.posts(date);
CREATE INDEX IF NOT EXISTS idx_images_post_id ON public.images(post_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON public.tags(name);
