'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, signOut, isAdmin } = useAuth();

  return (
    <nav className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            Garden Blog
          </Link>
          <div className="flex items-center gap-4">
            {isAdmin ? (
              <>
                <Link
                  href="/new"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  New Post
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Sign Out
                </button>
                <span className="ml-4 text-sm">Admin</span>
              </>
            ) : (
              user ? (
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/auth/sign-in"
                  className="px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Sign In
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
