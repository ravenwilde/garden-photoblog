'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import PostFormModal from './PostFormModal';
import { getCsrfToken } from '@/lib/csrf-client';

export default function Navbar() {
  const { isAdmin, signOut, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null during initial load or when not admin
  if (loading || !isAdmin) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 shadow-sm backdrop-blur-sm transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center px-2 py-2 text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <span className="text-xl font-semibold">8325.garden</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAdmin && (
              <div className="flex items-center space-x-4">
                <Link
                  href="/white-rabbit/tags"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Tags
                </Link>
                <button
                  onClick={() => setIsNewPostModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  New Post
                </button>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {mounted &&
                  (theme === 'dark' ? (
                    <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  ))}
              </button>
              <button
                onClick={async () => {
                  try {
                    await signOut();
                  } catch (error) {
                    console.error('Error signing out:', error);
                  }
                }}
                className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Post form modal */}
      <PostFormModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        title="Create New Post"
        onSuccess={async post => {
          if (post) {
            try {
              const token = await getCsrfToken();
              const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-csrf-token': token,
                },
                body: JSON.stringify(post),
              });

              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create post');
              }

              // Refresh the page cache
              router.refresh();

              // Close the modal
              setIsNewPostModalOpen(false);
            } catch (error) {
              console.error('Failed to create post:', error);
              alert('Failed to create post. Please try again.');
            }
          }
        }}
      />
    </nav>
  );
}
