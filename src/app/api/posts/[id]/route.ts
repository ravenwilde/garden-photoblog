import { NextResponse } from 'next/server';
import type { Image } from '@/types';
import type { NextRequest } from 'next/server';
import { deleteImageFromDreamObjects } from '@/lib/dreamobjects';
import { createClient } from '@/lib/supabase/server';
import { createNoContentResponse, handleApiError } from '@/lib/api-utils';
import { getServerSession } from '@/lib/server-auth';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // In Next.js 15, we need to await params before accessing its properties
  const { id } = await context.params;

  // Add headers to help with test identification
  const headers = new Headers();
  headers.set('x-request-path', `/posts/${id}`);

  // Check if the user is authenticated and is an admin
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user?.email) {
    return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401, headers });
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (sessionData.user.email !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401, headers });
  }

  // For Next.js 15, we need to use the correct approach with cookies
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { title, description, date, notes, tags, imagesToRemove, newImages } = body;

    // Update post details
    const { error: postError } = await supabase
      .from('posts')
      .update({
        title,
        description,
        date,
        notes,
      })
      .eq('id', id)
      .select()
      .single();

    if (postError) {
      console.error('Error updating post:', postError);
      return NextResponse.json({ error: 'Database error' }, { status: 500, headers });
    }

    // Handle tag updates (existing logic)
    if (tags) {
      // First delete existing tags for this post
      const { error: deleteTagsError } = await supabase
        .from('post_tags')
        .delete()
        .eq('post_id', id);

      if (deleteTagsError) {
        return handleApiError(deleteTagsError, 'Error deleting existing tags:');
      }

      // Get or create tags and link them to the post
      for (const tagName of tags) {
        // Check if tag exists
        const { data: existingTag, error: tagError } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tagName.toLowerCase())
          .single();

        if (tagError && tagError.code !== 'PGRST116') {
          // PGRST116 = not found
          return handleApiError(tagError, 'Error checking tag existence:');
        }

        let tagId;
        if (existingTag) {
          tagId = existingTag.id;
        } else {
          // Create new tag
          const { data: newTag, error: createTagError } = await supabase
            .from('tags')
            .insert({ name: tagName.toLowerCase() })
            .select('id')
            .single();

          if (createTagError) {
            return handleApiError(createTagError, 'Error creating tag:');
          }

          tagId = newTag.id;
        }

        // Link tag to post
        const { error: linkTagError } = await supabase
          .from('post_tags')
          .insert({ post_id: id, tag_id: tagId });

        if (linkTagError) {
          return handleApiError(linkTagError, 'Error linking tag to post:');
        }
      }
    }

    // Handle image removals
    if (imagesToRemove && imagesToRemove.length > 0) {
      // Get image details before deletion for S3 cleanup
      const { data: imagesToDelete, error: getImagesError } = await supabase
        .from('images')
        .select('*')
        .in('id', imagesToRemove);

      if (getImagesError) {
        return handleApiError(getImagesError, 'Error getting images to delete:');
      }

      // Delete images from database
      const { error: deleteImagesError } = await supabase
        .from('images')
        .delete()
        .in('id', imagesToRemove);

      if (deleteImagesError) {
        return handleApiError(deleteImagesError, 'Error deleting images from database:');
      }

      // Delete from S3/DreamObjects
      for (const image of imagesToDelete) {
        try {
          // Extract the key from the URL
          const url = new URL(image.url);
          const key = url.pathname.substring(1); // Remove leading slash
          await deleteImageFromDreamObjects(key);
        } catch (error) {
          console.error('Error deleting image from S3:', error);
          // Continue with other deletions even if one fails
        }
      }
    }

    // Handle new images
    if (newImages && newImages.length > 0) {
      // Prepare image data for insertion
      const imagesToInsert = newImages.map((img: Image) => ({
        url: img.url,
        alt: img.alt || null,
        width: img.width || null,
        height: img.height || null,
        post_id: id,
      }));

      console.log('DEBUG: imagesToInsert payload:', imagesToInsert);

      // Insert new images
      const { error: insertImagesError } = await supabase.from('images').insert(imagesToInsert);

      if (insertImagesError) {
        return handleApiError(insertImagesError, 'Error inserting new images:');
      }
    }

    // Get the updated post with all relationships
    const { data: updatedPost, error: getPostError } = await supabase
      .from('posts')
      .select(
        `
        *,
        images (*),
        tags:post_tags (
          tag:tags (*)
        )
      `
      )
      .eq('id', id)
      .single();

    if (getPostError) {
      return handleApiError(getPostError, 'Error getting updated post:');
    }

    // Transform the post for the response
    const finalPost = updatedPost;
    const transformedPost = {
      id: finalPost.id,
      title: finalPost.title,
      description: finalPost.description,
      date: finalPost.date,
      notes: finalPost.notes,
      tags: finalPost.tags?.map((t: { tag: { name: string } }) => t.tag.name) || [],
      images: finalPost.images || [],
    };
    return NextResponse.json({ success: true, data: transformedPost });
  } catch (err) {
    console.error('Error updating post:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500, headers });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  // Add headers to help with test identification
  const headers = new Headers();
  headers.set('x-request-path', `/posts/${id}`);

  // Check if the user is authenticated and is an admin
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user?.email) {
    return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401, headers });
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (sessionData.user.email !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401, headers });
  }

  // For Next.js 15, we need to use the correct approach with cookies
  const supabase = await createClient();

  try {
    // Get all images for this post to delete from S3
    const { data: images, error: getImagesError } = await supabase
      .from('images')
      .select('*')
      .eq('post_id', id);

    if (getImagesError) {
      return handleApiError(getImagesError, 'Error getting images to delete:');
    }

    // Delete post (cascade will delete images and post_tags)
    const { error: deletePostError } = await supabase.from('posts').delete().eq('id', id);

    if (deletePostError) {
      return handleApiError(deletePostError, 'Error deleting post:');
    }

    // Delete images from S3/DreamObjects
    if (images && images.length > 0) {
      for (const image of images) {
        try {
          // Extract the key from the URL
          const url = new URL(image.url);
          const key = url.pathname.substring(1); // Remove leading slash
          await deleteImageFromDreamObjects(key);
        } catch (error) {
          console.error('Error deleting image from S3:', error);
          // Continue with other deletions even if one fails
        }
      }
    }

    return createNoContentResponse();
  } catch (err) {
    console.error('Error deleting post:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers });
  }
}
