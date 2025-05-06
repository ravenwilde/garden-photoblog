'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { Tag } from '@/lib/tags';

interface TagFilterProps {
  tags: Tag[];
  className?: string;
}

export default function TagFilter({ tags, className = '' }: TagFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag');

  // Don't render if there are no tags with posts
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={`TagFilter ${className}`}>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Filter by Tag</h2>
      <div className="flex flex-wrap gap-2">
        <Link
          href={pathname}
          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
            !currentTag
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          aria-current={!currentTag ? 'page' : undefined}
        >
          All
        </Link>

        {tags.map(tag => (
          <Link
            key={tag.id}
            href={`${pathname}?tag=${encodeURIComponent(tag.name)}`}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              currentTag === tag.name
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            aria-current={currentTag === tag.name ? 'page' : undefined}
          >
            {tag.name}
            <span className="ml-1 text-xs opacity-70">({tag.post_count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
