import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { uploadImage } from '@/lib/dreamobjects';
import { getServerSession } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user?.email) {
    return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (sessionData.user.email !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 });
  }

  try {
    if (!process.env.DREAMOBJECTS_ACCESS_KEY || !process.env.DREAMOBJECTS_SECRET_KEY || !process.env.DREAMOBJECTS_BUCKET_NAME) {
      console.error('Missing DreamObjects configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      console.error('No valid file in request');
      return NextResponse.json(
        { error: 'No valid file uploaded' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    console.log('Processing file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    try {
      const result = await uploadImage(file);
      console.log('Upload successful:', result);
      return NextResponse.json(result);
    } catch (uploadError) {
      console.error('DreamObjects upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload to storage' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request processing error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to process upload request' },
      { status: 500 }
    );
  }
}
