'use server';

import { revalidatePath } from 'next/cache';
import { deletePost } from '@/lib/posts';

export async function deletePostAction(id: string) {
  try {
    await deletePost(id);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error };
  }
}
