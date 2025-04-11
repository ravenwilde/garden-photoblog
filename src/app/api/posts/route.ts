import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createPost, getAllPosts, deletePost, updatePost } from '@/lib/posts';
import type { Post, NewPost } from '@/types';
import { getServerUser } from '@/lib/server-auth';

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to get posts:', error);
    return NextResponse.json(
      { error: 'Failed to get posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getServerUser();

  if (!user?.email) {
    return NextResponse.json({ error: 'Unauthorized - No user' }, { status: 401 });
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (user.email !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 });
  }

  try {
    const post: NewPost = await request.json();
    
    // Validate required fields
    if (!post.title || !post.description || !post.date || !post.images?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newPost = await createPost(post);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    await deletePost(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates }: { id: string } & Partial<Post> = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const updatedPost = await updatePost(id, updates);
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Failed to update post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}
