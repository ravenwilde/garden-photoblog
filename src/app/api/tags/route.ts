import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAllTags, getAllTagsAdmin, createTag } from '@/lib/tags';
import { getServerSession } from '@/lib/server-auth';

export async function GET(req: NextRequest) {
  try {
    // Check if the request is from the admin page
    const isAdminRequest = req.headers.get('referer')?.includes('/white-rabbit/');

    // Try to get the session to verify admin status
    let isAdmin = false;
    try {
      const sessionData = await getServerSession();
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      isAdmin = sessionData?.user?.email === adminEmail;
    } catch (sessionError) {
      // If session check fails, continue with non-admin view
      console.error('Session check failed:', sessionError);
    }

    // Use admin function if request is from admin area and user is admin
    const tags = isAdminRequest && isAdmin ? await getAllTagsAdmin() : await getAllTags();

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Failed to get tags:', error);
    return NextResponse.json({ error: 'Failed to get tags' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionData = await getServerSession();

    if (!sessionData || !sessionData.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (sessionData.user.email !== adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid tag name' }, { status: 400 });
    }

    const tag = await createTag(name);
    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error creating tag:', error);
    const message = error instanceof Error ? error.message : 'Failed to create tag';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
