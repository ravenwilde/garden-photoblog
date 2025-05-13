import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { deleteTag, updateTag } from '@/lib/tags';
import { checkAdminAuth, createNoContentResponse, handleApiError } from '@/lib/api-utils';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Check if the user is authenticated and is an admin
  const authError = await checkAdminAuth(true);
  if (authError) return authError;

  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { id } = await context.params;
    const updatedTag = await updateTag(id, name);
    return NextResponse.json(updatedTag);
  } catch (error) {
    return handleApiError(error, 'Error updating tag:', true, 'Database error');
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  // Check if the user is authenticated and is an admin
  const authError = await checkAdminAuth(true);
  if (authError) return authError;

  try {
    await deleteTag(id);
    return createNoContentResponse();
  } catch (error) {
    if (error instanceof Error && error.message === 'Cannot delete tag that is still in use') {
      return NextResponse.json(
        { error: 'Cannot delete tag that is still in use' },
        { status: 409 }
      );
    }
    return handleApiError(error, 'Error deleting tag:', true, 'Database error');
  }
}
