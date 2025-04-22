import { NextResponse } from 'next/server';
import type { Image } from '@/types';
import type { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getServerSession } from '@/lib/server-auth';
import { deleteImageFromDreamObjects } from '@/lib/dreamobjects';

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user?.email) {
    return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (sessionData.user.email !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 });
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

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
        notes
      })
      .eq('id', id)
      .select()
      .single();

    if (postError) {
      console.error('Error updating post:', postError);
      return NextResponse.json({ error: postError.message }, { status: 500 });
    }

    // Handle tag updates (existing logic)
    if (tags) {
      // Delete existing post-tag relationships
      const { error: deleteTagError } = await supabase
        .from('post_tags')
        .delete()
        .eq('post_id', id);
      if (deleteTagError) {
        console.error('Error deleting post-tag relationships:', deleteTagError);
        return NextResponse.json({ error: deleteTagError.message }, { status: 500 });
      }
      if (tags.length > 0) {
        // Ensure all tags exist
        const { error: tagError } = await supabase
          .from('tags')
          .upsert(tags.map((name: string) => ({ name })), { onConflict: 'name' });

        if (tagError) {
          console.error('Error upserting tags:', tagError);
          return NextResponse.json({ error: tagError.message }, { status: 500 });
        }

        // Get the tag IDs
        const { data: tagData, error: tagSelectError } = await supabase
          .from('tags')
          .select('id, name')
          .in('name', tags);

        if (tagSelectError || !tagData) {
          console.error('Error selecting tags:', tagSelectError);
          return NextResponse.json({ error: tagSelectError?.message || 'Failed to select tags' }, { status: 500 });
        }

        // Create new post-tag relationships
        const { error: postTagError } = await supabase
          .from('post_tags')
          .insert(
            tagData.map(tag => ({
              post_id: id,
              tag_id: tag.id
            }))
          );

        if (postTagError) {
          console.error('Error creating post-tag relationships:', postTagError);
          return NextResponse.json({ error: postTagError.message }, { status: 500 });
        }
      }
    }

    // --- IMAGE MANAGEMENT ---
    // Remove images
    if (Array.isArray(imagesToRemove) && imagesToRemove.length > 0) {
      // Get image rows to find S3 keys
      const { data: imagesForDelete, error: fetchImgErr } = await supabase
        .from('images')
        .select('id, url')
        .in('id', imagesToRemove);
      if (fetchImgErr) {
        console.error('Error fetching images to delete:', fetchImgErr);
        return NextResponse.json({ error: fetchImgErr.message }, { status: 500 });
      }
      // Delete from S3 and DB
      // Helper to extract S3 key from URL
      function extractS3KeyFromUrl(url: string): string {
        try {
          const parsed = new URL(url);
          // Find the path after the bucket name (e.g., /images/12345-filename.jpg)
          // Assumes the key is everything after the last '/' before the filename
          // e.g., https://bucketname.region.digitaloceanspaces.com/images/12345-filename.jpg
          // returns 'images/12345-filename.jpg'
          const path = parsed.pathname;
          // Remove leading slash if present
          return path.startsWith('/') ? path.slice(1) : path;
        } catch {
          // If not a valid URL, fallback to legacy extraction
          const urlParts = url.split('/');
          if (urlParts.length >= 2) {
            return urlParts.slice(-2).join('/');
          }
          throw new Error('Could not extract S3 key from image URL: ' + url);
        }
      }

      for (const img of imagesForDelete) {
        try {
          const key = extractS3KeyFromUrl(img.url);
          await deleteImageFromDreamObjects(key);
        } catch (err) {
          console.error('Error deleting from S3 or extracting key:', err);
        }  // Continue to DB delete
      }
      // Delete from DB
      const { error: dbDeleteErr } = await supabase
        .from('images')
        .delete()
        .in('id', imagesToRemove);
      if (dbDeleteErr) {
        console.error('Error deleting images from DB:', dbDeleteErr);
        return NextResponse.json({ error: dbDeleteErr.message }, { status: 500 });
      }
    }
    // Add new images
    if (Array.isArray(newImages) && newImages.length > 0) {
      // Insert each new image (assume already uploaded, just add DB row)
      const imagesToInsert = newImages.map((img: Image) => {
        const base = {
          url: img.url,
          alt: img.alt || '',
          width: img.width,
          height: img.height,
          post_id: id,
        };
        if (img.timestampTaken && typeof img.timestampTaken === 'string') {
          return { ...base, timestamp_taken: img.timestampTaken };
        }
        return base; // timestamp_taken omitted if not present
      });
      console.log('DEBUG: imagesToInsert payload:', JSON.stringify(imagesToInsert, null, 2));
      const { error: insertImgErr } = await supabase.from('images').insert(imagesToInsert);
      if (insertImgErr) {
        console.error('Error inserting new images:', insertImgErr);
        return NextResponse.json({ error: insertImgErr.message }, { status: 500 });
      }
    }

    // Get the updated post with tags and images
    const { data: finalPost, error: finalError } = await supabase
      .from('posts')
      .select(`*, tags:post_tags(tag:tags(name)), images(*)`)
      .eq('id', id)
      .single();
    if (finalError) {
      console.error('Error fetching updated post:', finalError);
      return NextResponse.json({ error: finalError.message }, { status: 500 });
    }
    // Transform the response to match the Post type
    const transformedPost = {
      ...finalPost,
      tags: finalPost.tags?.map((t: { tag: { name: string } }) => t.tag.name) || [],
      images: finalPost.images || [],
    };
    return NextResponse.json({ success: true, data: transformedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user?.email) {
    return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (sessionData.user.email !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 });
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // Delete post-tag relationships first
    const { error: tagError } = await supabase
      .from('post_tags')
      .delete()
      .eq('post_id', id);

    if (tagError) {
      console.error('Error deleting post-tag relationships:', tagError);
      return NextResponse.json({ error: tagError.message }, { status: 500 });
    }

    // Then delete the post
    const { error: postError } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (postError) {
      console.error('Error deleting post:', postError);
      return NextResponse.json({ error: postError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
