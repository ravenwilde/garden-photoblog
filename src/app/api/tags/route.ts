import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAllTags, createTag } from '@/lib/tags';
import { getServerSession } from '@/lib/server-auth';

export async function GET() {
  try {
    const tags = await getAllTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Failed to get tags:', error);
    return NextResponse.json(
      { error: 'Failed to get tags' },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
