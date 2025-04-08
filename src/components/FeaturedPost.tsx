'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Post } from '@/types';
import { format } from 'date-fns';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { deletePostAction } from '@/app/actions';
import ImageModal from './ImageModal';

interface FeaturedPostProps {
  post: Post;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isAdmin } = useAuth();
  const router = useRouter();
  return (
    <div className="relative w-full h-[60vh] mb-12 group">
      <div 
        className="block w-full h-full cursor-pointer" 
        onClick={() => setIsModalOpen(true)}>
        {/* Image container with gradient overlay */}
        <div className="relative w-full h-full">
          <Image
            src={post.images[0].url}
            alt={post.images[0].alt || post.title}
            fill
            className="object-cover rounded-xl"
            sizes="100vw"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-3xl">
            <time dateTime={post.date} className="block text-sm text-gray-300 mb-4">
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </time>
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-4xl font-bold group-hover:text-green-400 transition-colors">
                {post.title}
              </h1>
              {isAdmin && (
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this post?')) {
                      setIsDeleting(true);
                      try {
                        const result = await deletePostAction(post.id);
                        if (result.success) {
                          router.refresh();
                        } else {
                          alert('Failed to delete post');
                        }
                      } catch (error) {
                        console.error('Error deleting post:', error);
                        alert('Failed to delete post');
                      } finally {
                        setIsDeleting(false);
                      }
                    }
                  }}
                  disabled={isDeleting}
                  className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                  title="Delete post"
                >
                  <TrashIcon className="h-6 w-6" />
                </button>
              )}
            </div>
            <p className="text-lg text-gray-200 mb-4">
              {post.description}
            </p>
            {post.notes && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-300 mb-1">Notes:</h3>
                <p className="text-sm text-gray-200">{post.notes}</p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-sm bg-emerald-900/50 text-emerald-100 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ImageModal
        images={post.images}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
