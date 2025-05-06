import { supabase } from './supabase';
import type { Tag } from './tags';

/**
 * Get all tags without using cookies - safe for static generation
 * This version uses the public Supabase client instead of the server client
 */
export async function getAllTagsStatic(): Promise<Tag[]> {
  // Get all tags with post count
  const { data: tags, error } = await supabase
    .from('tags')
    .select(
      `
      id,
      name,
      post_tags (
        post_id
      )
    `
    )
    .order('name');

  if (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }

  if (!tags) {
    return [];
  }

  return (
    tags
      .map((tag: { id: string; name: string; post_tags?: Array<{ post_id: string }> }) => ({
        id: tag.id,
        name: tag.name,
        post_count: tag.post_tags?.length || 0,
      }))
      // Filter out tags with zero posts
      .filter(tag => tag.post_count > 0)
  );
}

/**
 * Get all tags with post counts, sorted by popularity (most used first)
 * This version uses the public Supabase client instead of the server client
 */
export async function getTagsWithPostCountsStatic(): Promise<Tag[]> {
  // Get all tags with post count
  const { data: tags, error } = await supabase.from('tags').select(`
      id,
      name,
      post_tags (
        post_id
      )
    `);

  if (error) {
    console.error('Error fetching tags with post counts:', error);
    throw error;
  }

  if (!tags) {
    return [];
  }

  // Map, filter out tags with zero posts, and sort by post count (descending)
  return tags
    .map((tag: { id: string; name: string; post_tags?: Array<{ post_id: string }> }) => ({
      id: tag.id,
      name: tag.name,
      post_count: tag.post_tags?.length || 0,
    }))
    .filter(tag => tag.post_count > 0)
    .sort((a, b) => b.post_count - a.post_count);
}
