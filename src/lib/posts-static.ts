import { Post } from '@/types';
import { supabase } from './supabase';

/**
 * Get all posts without using cookies - safe for static generation
 * This version uses the public Supabase client instead of the server client
 */
export async function getAllPostsStatic(tagFilter?: string): Promise<Post[]> {
  // Start building the query
  let query = supabase
    .from('posts')
    .select(
      `
      id,
      title,
      description,
      notes,
      date,
      created_at,
      updated_at,
      images (id, url, alt, width, height),
      tags (name)
    `
    )
    .order('date', { ascending: false });

  // If a tag filter is provided, modify the query to filter by tag
  if (tagFilter) {
    // Get the tag ID first
    const { data: tagData, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('name', tagFilter)
      .single();

    if (tagError && tagError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned"
      console.error('Error fetching tag:', tagError);
      throw tagError;
    }

    // If tag exists, filter posts by that tag
    if (tagData) {
      // Get post IDs that have this tag
      const { data: postTags, error: postTagError } = await supabase
        .from('post_tags')
        .select('post_id')
        .eq('tag_id', tagData.id);

      if (postTagError) {
        console.error('Error fetching post tags:', postTagError);
        throw postTagError;
      }

      // If there are posts with this tag, filter the main query
      if (postTags && postTags.length > 0) {
        const postIds = postTags.map(pt => pt.post_id);
        query = query.in('id', postIds);
      } else {
        // No posts with this tag, return empty array early
        return [];
      }
    } else {
      // Tag doesn't exist, return empty array
      return [];
    }
  }

  // Execute the query
  const { data: posts, error } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }

  // Get all existing tags
  const { data: existingTags } = await supabase.from('tags').select('id, name');

  return posts.map(post => ({
    ...post,
    images: post.images || [],
    tags: (post.tags || []).map(tag => tag.name),
    // Create missing tags
    missingTags: (post.tags || []).filter(name => !existingTags?.some(tag => tag.name === name)),
  }));
}
