import { Post, NewPost, Image } from '@/types';
import { supabase } from './supabase';

// Helper to refresh schema cache
async function refreshSchemaCache() {
  try {
    // Re-initialize the client to refresh schema
    await supabase.from('images').select('id').limit(1);
    await supabase.from('posts').select('id').limit(1);
  } catch (error) {
    console.warn('Failed to refresh schema cache:', error);
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      description,
      notes,
      date,
      created_at,
      updated_at,
      images (id, url, alt, width, height),
      tags (name)
    `)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }

  // Get all existing tags
  const { data: existingTags } = await supabase
    .from('tags')
    .select('id, name');

  return posts.map(post => ({
    ...post,
    images: post.images || [],
    tags: (post.tags || []).map(tag => tag.name),
    // Create missing tags
    missingTags: (post.tags || []).filter(
      name => !existingTags?.some(tag => tag.name === name)
    )
  }));
}

export async function createPost(post: NewPost): Promise<Post> {
  // Refresh schema cache before operations
  await refreshSchemaCache();
  const timestamp = new Date().toISOString();
  const { data: newPost, error: postError } = await supabase
    .from('posts')
    .insert({
      title: post.title,
      description: post.description,
      notes: post.notes,
      date: post.date,
      created_at: timestamp,
      updated_at: timestamp
    })
    .select('id')
    .single();

  if (postError || !newPost) {
    console.error('Error creating post:', postError);
    throw postError;
  }

  // Insert images
  if (post.images.length > 0) {
    type ImageInsertData = {
      post_id: string;
      url: string;
      alt: string;
      width: number;
      height: number;
    };

    const imageData: ImageInsertData[] = post.images.map((image: Image) => ({
      post_id: newPost.id,
      url: image.url,
      alt: image.alt || '',
      width: image.width,
      height: image.height
    }));

    const { error: imageError } = await supabase
      .rpc('insert_images', { image_data: imageData });
    if (imageError) {
      console.error('Error inserting images:', imageError);
      throw imageError;
    }
  }

  // Insert tags if any
  if (post.tags && post.tags.length > 0) {
    // First, ensure all tags exist
    const { error: tagError } = await supabase
      .from('tags')
      .upsert(
        post.tags.map(name => ({ name })),
        { onConflict: 'name' }
      );

    if (tagError) {
      console.error('Error upserting tags:', tagError);
      throw tagError;
    }

    // Then, get the tag IDs
    // Get all existing tags
    const { data: existingTags } = await supabase
      .from('tags')
      .select('id, name')
      .in('name', post.tags || []);

    if (!existingTags) {
      console.error('Error selecting tags:');
      throw new Error('Error selecting tags');
    }

    // Create the post-tag relationships
    const { error: postTagError } = await supabase
      .from('post_tags')
      .insert(
        existingTags.map(tag => ({
          post_id: newPost.id,
          tag_id: tag.id
        }))
      );

    if (postTagError) {
      console.error('Error creating post-tag relationships:', postTagError);
      throw postTagError;
    }
  }

  // Fetch the complete post with all fields
  const { data: completePost, error: fetchError } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      description,
      notes,
      date,
      created_at,
      updated_at,
      images (id, url, alt, width, height),
      tags (name)
    `)
    .eq('id', newPost.id)
    .single();

  if (fetchError || !completePost) {
    console.error('Error fetching complete post:', fetchError);
    throw fetchError;
  }

  return {
    ...completePost,
    images: completePost.images || [],
    tags: (completePost.tags || []).map(tag => tag.name)
  };
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

export async function updatePost(id: string, updatedPost: Partial<Post>): Promise<Post> {
  // Update post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .update({
      title: updatedPost.title,
      description: updatedPost.description,
      notes: updatedPost.notes,
      date: updatedPost.date
    })
    .eq('id', id)
    .select()
    .single();

  if (postError || !post) {
    console.error('Error updating post:', postError);
    throw postError;
  }

  // Update images if provided
  if (updatedPost.images) {
    // Delete existing images
    const { error: deleteError } = await supabase
      .from('images')
      .delete()
      .eq('post_id', id);

    if (deleteError) {
      console.error('Error deleting images:', deleteError);
      throw deleteError;
    }

    // Insert new images
    if (updatedPost.images.length > 0) {
      const { error: imageError } = await supabase
        .from('images')
        .insert(
          updatedPost.images.map(image => ({
            post_id: id,
            ...image
          }))
        );

      if (imageError) {
        console.error('Error inserting images:', imageError);
        throw imageError;
      }
    }
  }

  // Update tags if provided
  if (updatedPost.tags) {
    // Delete existing post-tag relationships
    const { error: deleteTagError } = await supabase
      .from('post_tags')
      .delete()
      .eq('post_id', id);

    if (deleteTagError) {
      console.error('Error deleting post-tag relationships:', deleteTagError);
      throw deleteTagError;
    }

    if (updatedPost.tags.length > 0) {
      // Ensure all tags exist
      const { error: tagError } = await supabase
        .from('tags')
        .upsert(
          updatedPost.tags.map(name => ({ name })),
          { onConflict: 'name' }
        );

      if (tagError) {
        console.error('Error upserting tags:', tagError);
        throw tagError;
      }

      // Get the tag IDs
      const { data: tags, error: tagSelectError } = await supabase
        .from('tags')
        .select('id, name')
        .in('name', updatedPost.tags);

      if (tagSelectError || !tags) {
        console.error('Error selecting tags:', tagSelectError);
        throw tagSelectError;
      }

      // Create new post-tag relationships
      const { error: postTagError } = await supabase
        .from('post_tags')
        .insert(
          tags.map(tag => ({
            post_id: id,
            tag_id: tag.id
          }))
        );

      if (postTagError) {
        console.error('Error creating post-tag relationships:', postTagError);
        throw postTagError;
      }
    }
  }

  // Return the complete updated post
  return {
    ...post,
    ...updatedPost,
    id
  };
}
