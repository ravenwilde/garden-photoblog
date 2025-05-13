'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Tag } from '@/lib/tags';

interface TagListProps {
  tags: Tag[] | string[];
  currentTag?: string | null;
  className?: string;
  onTagSelect?: (tagName?: string) => void;
  showCount?: boolean;
  linkTags?: boolean;
  variant?: 'default' | 'form';
}

export default function TagList({
  tags,
  currentTag = null,
  className = '',
  onTagSelect,
  showCount = true,
  linkTags = true,
  variant = 'default',
}: TagListProps) {
  const pathname = usePathname();

  // Get tag item class based on whether it's selected
  const getTagItemClass = (isSelected: boolean) => {
    return `px-3 py-1.5 rounded-full text-sm transition-colors ${
      isSelected
        ? 'bg-emerald-500 text-white'
        : variant === 'form'
          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-800'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
    }`;
  };

  // Render tag content (label and count)
  const renderTagContent = (tagName: string, count?: number) => (
    <>
      {tagName}
      {showCount && count !== undefined && (
        <span className="ml-1 text-xs opacity-70">({count})</span>
      )}
    </>
  );

  // Extract tag name and count from tag object or string
  const getTagInfo = (tag: Tag | string): { name: string; count?: number } => {
    if (typeof tag === 'string') {
      return { name: tag };
    }
    return { name: tag.name, count: tag.post_count };
  };

  // If using buttons for tag selection
  if (onTagSelect) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <button
          onClick={() => onTagSelect()}
          className={getTagItemClass(!currentTag)}
          aria-current={!currentTag ? 'page' : undefined}
        >
          All
        </button>

        {tags.map((tag, index) => {
          const { name, count } = getTagInfo(tag);
          return (
            <button
              key={`tag-${name}-${index}`}
              onClick={() => onTagSelect(name)}
              className={getTagItemClass(currentTag === name)}
              aria-current={currentTag === name ? 'page' : undefined}
            >
              {renderTagContent(name, count)}
            </button>
          );
        })}
      </div>
    );
  }

  // If using links for tag navigation
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {linkTags ? (
        <>
          <Link
            href={pathname}
            className={getTagItemClass(!currentTag)}
            aria-current={!currentTag ? 'page' : undefined}
          >
            All
          </Link>

          {tags.map((tag, index) => {
            const { name, count } = getTagInfo(tag);
            return (
              <Link
                key={`tag-${name}-${index}`}
                href={`${pathname}?tag=${encodeURIComponent(name)}`}
                className={getTagItemClass(currentTag === name)}
                aria-current={currentTag === name ? 'page' : undefined}
              >
                {renderTagContent(name, count)}
              </Link>
            );
          })}
        </>
      ) : (
        // Just display tags without links
        tags.map((tag, index) => {
          const { name, count } = getTagInfo(tag);
          return (
            <span key={`tag-${name}-${index}`} className={getTagItemClass(currentTag === name)}>
              {renderTagContent(name, count)}
            </span>
          );
        })
      )}
    </div>
  );
}
