'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { isAdmin, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);



  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 shadow-sm backdrop-blur-sm transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center px-2 py-2 text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <span className="text-xl font-semibold">Garden Blog</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Link
                href="/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                New Post
              </Link>
            )}

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {mounted && (
                  theme === 'dark' ? (
                    <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  )
                )}
              </button>
              <button
                onClick={() => signOut()}
                className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
