import { createClient } from './supabase/server';

export interface Tag {
  id: string;
  name: string;
  post_count?: number;
}

export async function createTag(name: string): Promise<Tag> {
  const supabase = createClient();

  const { data: newTag, error } = await supabase
    .from('tags')
    .upsert([{ 
      name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }], { 
      onConflict: 'name',
      ignoreDuplicates: true 
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating tag:', error);
    throw error;
  }

  if (!newTag) {
    throw new Error('Failed to create tag');
  }

  return {
    id: newTag.id,
    name: newTag.name,
    post_count: 0
  };
}

export async function getAllTags(): Promise<Tag[]> {
  const supabase = createClient();

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

  if (!tags) {
    return [];
  }

  return tags.map((tag: { id: string; name: string; post_tags?: Array<{ post_id: string }> }) => ({
    id: tag.id,
    name: tag.name,
    post_count: tag.post_tags?.length || 0
  }));
}

export async function updateTag(id: string, newName: string): Promise<Tag> {
  const supabase = createClient();

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

  if (!updatedTag) {
    throw new Error('Tag not found');
  }

  return {
    id: updatedTag.id,
    name: updatedTag.name,
    post_count: 0
  };
}

export async function deleteTag(id: string): Promise<void> {
  const supabase = createClient();

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
