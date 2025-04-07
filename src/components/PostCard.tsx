'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import ImageModal from './ImageModal';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="relative h-64 bg-gray-100 dark:bg-gray-700">
        {post.images.length > 0 && (
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <Image
              src={post.images[0].url}
              alt={post.images[0].alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        {post.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            +{post.images.length - 1} more
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {post.title}
          </h2>
          <time className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(post.date), 'MMM d, yyyy')}
          </time>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-3">
          {post.description}
        </p>
        
        {post.notes && (
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Notes:</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{post.notes}</p>
          </div>
        )}
        
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <ImageModal
        images={post.images}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
