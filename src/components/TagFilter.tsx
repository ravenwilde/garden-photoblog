'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import type { Tag } from '@/lib/tags';

interface TagFilterProps {
  tags: Tag[];
  className?: string;
}

export default function TagFilter({ tags, className = '' }: TagFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on a mobile device on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Don't render if there are no tags with posts
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={`TagFilter ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left flex items-center justify-between text-lg font-medium text-gray-900 dark:text-white mb-3 lg:mb-3 lg:cursor-default"
        aria-expanded={isExpanded}
        aria-controls="tag-filter-content"
      >
        <span>Filter by Tag</span>
        <span className="lg:hidden">
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </span>
      </button>
      <div
        id="tag-filter-content"
        className={`flex flex-wrap gap-2 overflow-hidden lg:overflow-visible transition-all duration-300 ease-in-out ${isMobile ? (isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0') : 'max-h-96 opacity-100'}`}
      >
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
