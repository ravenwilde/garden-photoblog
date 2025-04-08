'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TagManager from '@/components/TagManager';
import { useAuth } from '@/lib/auth';

export default function TagsPage() {
  const router = useRouter();
  const { isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace('/white-rabbit/sign-in');
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Manage Tags
      </h1>
      <div className="w-full max-w-2xl">
        <TagManager />
      </div>
    </div>
  );
}
