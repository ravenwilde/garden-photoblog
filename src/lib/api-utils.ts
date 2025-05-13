import { NextResponse } from 'next/server';
import { getServerSession } from './server-auth';

/**
 * Utility function to check if the user is authenticated and is an admin
 * @param compatibilityMode If true, uses original error messages for backward compatibility with tests
 */
export async function checkAdminAuth(compatibilityMode = false) {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user?.email) {
    const errorMessage = compatibilityMode ? 'Unauthorized' : 'Unauthorized - No session';
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (sessionData.user.email !== adminEmail) {
    const errorMessage = compatibilityMode ? 'Unauthorized' : 'Unauthorized - Not admin';
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }

  return null; // Auth check passed
}

/**
 * Utility function to create a 204 No Content response
 * Uses the correct approach for Next.js 15
 */
export function createNoContentResponse() {
  return new Response(null, { status: 204 });
}

/**
 * Utility function to handle common API errors
 * @param error The error to handle
 * @param customMessage Optional custom message to log with the error
 * @param compatibilityMode If true, uses original error messages for backward compatibility with tests
 * @param compatibilityErrorMessage The error message to use in compatibility mode
 */
export function handleApiError(
  error: unknown,
  customMessage?: string,
  compatibilityMode = false,
  compatibilityErrorMessage?: string
) {
  console.error(customMessage || 'API error:', error);

  if (error instanceof Error) {
    // Return specific error messages for known error types with specific status codes
    if (error.message === 'Cannot delete tag that is still in use') {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error.message === 'A tag with this name already exists') {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    // For all other errors, return a generic message or the compatibility message
    if (compatibilityMode && compatibilityErrorMessage) {
      return NextResponse.json({ error: compatibilityErrorMessage }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  // For non-Error objects, return a generic message or the compatibility message
  if (compatibilityMode && compatibilityErrorMessage) {
    return NextResponse.json({ error: compatibilityErrorMessage }, { status: 500 });
  }
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
