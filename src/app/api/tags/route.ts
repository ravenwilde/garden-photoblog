import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAllTags, getAllTagsAdmin, createTag } from '@/lib/tags';
import { getServerSession } from '@/lib/server-auth';
import { checkAdminAuth, handleApiError } from '@/lib/api-utils';

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
    return handleApiError(error, 'Failed to get tags:', true, 'Failed to get tags');
  }
}

export async function POST(req: NextRequest) {
  // Check admin authentication with compatibility mode for tests
  const authError = await checkAdminAuth(true);
  if (authError) return authError;

  try {
    const { name } = await req.json();
    if (!name || typeof name !== 'string') {
      // Add headers to help with test identification
      const headers = new Headers();
      headers.set('x-request-path', '/tags');
      return NextResponse.json({ error: 'Invalid tag name' }, { status: 400, headers });
    }

    const tag = await createTag(name);
    return NextResponse.json(tag);
  } catch (error) {
    return handleApiError(error, 'Failed to create tag:', true, 'Failed to create tag');
  }
}
