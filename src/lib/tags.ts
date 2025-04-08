import { supabase } from './supabase';

export interface Tag {
  id: string;
  name: string;
  post_count?: number;
}

export async function getAllTags(): Promise<Tag[]> {
  // Get all tags with post count
  const { data: tags, error } = await supabase
    .from('tags')
    .select(`
      id,
      name,
      post_tags (
        post_id
      )
    `)
    .order('name');

  if (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }

  return tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    post_count: tag.post_tags?.length || 0
  }));
}

export async function updateTag(id: string, newName: string): Promise<Tag> {
  // First check if the new name already exists
  const { data: existingTag } = await supabase
    .from('tags')
    .select('id')
    .eq('name', newName)
    .neq('id', id)
    .single();

  if (existingTag) {
    throw new Error('A tag with this name already exists');
  }

  const { data: updatedTag, error } = await supabase
    .from('tags')
    .update({ name: newName })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating tag:', error);
    throw error;
  }

  return updatedTag;
}

export async function deleteTag(id: string): Promise<void> {
  // First get the tag name
  const { data: tag, error: tagError } = await supabase
    .from('tags')
    .select('name')
    .eq('id', id)
    .single();

  if (tagError || !tag) {
    console.error('Error finding tag:', tagError);
    throw tagError || new Error('Tag not found');
  }

  // Check if the tag is used in any posts
  const { data: postTags, error: postTagsError } = await supabase
    .from('post_tags')
    .select('post_id')
    .eq('tag_id', id);

  if (postTagsError) {
    console.error('Error checking tag usage:', postTagsError);
    throw postTagsError;
  }

  if (postTags && postTags.length > 0) {
    throw new Error('Cannot delete tag that is still in use');
  }

  // Delete the tag
  const { error: deleteError } = await supabase
    .from('tags')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Error deleting tag:', deleteError);
    throw deleteError;
  }
}
