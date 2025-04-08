import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { deleteTag, updateTag } from '@/lib/tags';

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user?.email || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }


    const updatedTag = await updateTag(id, name);
    return NextResponse.json(updatedTag);
  } catch (error) {
    if (error instanceof Error && error.message === 'A tag with this name already exists') {
      return new NextResponse(error.message, { status: 409 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user?.email || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {

    await deleteTag(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Cannot delete tag that is still in use') {
      return new NextResponse(error.message, { status: 409 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
