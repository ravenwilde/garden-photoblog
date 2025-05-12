'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import type { Tag } from '@/lib/tags';
import FilterModal from './FilterModal';

interface TagFilterProps {
  tags: Tag[];
  className?: string;
}

export default function TagFilter({ tags, className = '' }: TagFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag');
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Render tag list for both modal and desktop view
  const renderTagList = () => (
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
  );

  return (
    <div className={`TagFilter ${className}`}>
      {/* Mobile view - button to open modal */}
      {isMobile ? (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-between bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-lg mb-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Open filter options"
          >
            <span className="flex items-center">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              <span>Filter by Tag</span>
            </span>
            {currentTag && (
              <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs">
                {currentTag}
              </span>
            )}
          </button>

          <FilterModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Filter Options"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h3>
                {renderTagList()}
              </div>
              {/* Additional filter options can be added here */}
            </div>
          </FilterModal>
        </>
      ) : (
        /* Desktop view - regular filter */
        <>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Filter by Tag</h2>
          <div id="tag-filter-content" className="flex flex-wrap gap-2">
            {renderTagList()}
          </div>
        </>
      )}
    </div>
  );
}
