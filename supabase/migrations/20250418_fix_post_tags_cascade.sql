-- Fix post_tags foreign key to cascade deletes from posts
ALTER TABLE public.post_tags
  DROP CONSTRAINT IF EXISTS post_tags_post_id_fkey,
  ADD CONSTRAINT post_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

-- (Optional, but recommended) Also ensure tag deletes cascade to post_tags
ALTER TABLE public.post_tags
  DROP CONSTRAINT IF EXISTS post_tags_tag_id_fkey,
  ADD CONSTRAINT post_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;
