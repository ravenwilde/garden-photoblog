'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/PostForm';
import type { NewPost } from '@/types';
import { useAuth } from '@/lib/auth';
import { getCsrfToken } from '@/lib/csrf-client';

export default function NewPost() {
  const router = useRouter();
  const { isAdmin, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!isAdmin && !loading) {
      if (!isAdmin) {
        timeoutId = setTimeout(() => {
          router.replace('/white-rabbit');
        }, 100);
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loading, isAdmin, router]);

  // Don't render anything while checking auth
  if (loading || !isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  const handleSubmit = async (post: NewPost) => {
    setIsSubmitting(true);
    try {
      const token = await getCsrfToken();
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': token
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create post');
      }

      // Refresh the page cache
      router.refresh();
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render anything while checking auth
  if (loading || !isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Create New Post
      </h1>
      <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
