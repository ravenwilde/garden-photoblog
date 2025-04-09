import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getServerSession } from '@/lib/server-auth';

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (session.user.email !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 });
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const body = await request.json();
    const { title, description, date, notes, tags } = body;

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

    // Update tags if provided
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
          .upsert(
            tags.map((name: string) => ({ name })),
            { onConflict: 'name' }
          );

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

    // Get the updated post with tags
    const { data: finalPost, error: finalError } = await supabase
      .from('posts')
      .select(`
        *,
        tags:post_tags(
          tag:tags(name)
        )
      `)
      .eq('id', id)
      .single();

    if (finalError) {
      console.error('Error fetching updated post:', finalError);
      return NextResponse.json({ error: finalError.message }, { status: 500 });
    }

    // Transform the response to match the Post type
    const transformedPost = {
      ...finalPost,
      tags: finalPost.tags?.map((t: { tag: { name: string } }) => t.tag.name) || []
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
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (session.user.email !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 });
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
