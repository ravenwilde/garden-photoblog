'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignInForm from '@/components/forms/SignInForm';
import { useAuth } from '@/lib/auth';

export default function SignInPage() {
  const router = useRouter();
  const { isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAdmin) {
      router.replace('/');
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!loading && isAdmin) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <SignInForm />
    </div>
  );
}
