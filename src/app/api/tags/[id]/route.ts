import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { deleteTag, updateTag } from '@/lib/tags';
import { getServerSession } from '@/lib/server-auth';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user?.email) {
    return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (sessionData.user.email !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { id } = await context.params;
    const updatedTag = await updateTag(id, name);
    return NextResponse.json(updatedTag);
  } catch (error) {
    if (error instanceof Error && error.message === 'A tag with this name already exists') {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user?.email) {
    return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (sessionData.user.email !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 });
  }

  try {
    await deleteTag(id);
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Cannot delete tag that is still in use') {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
