'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import ImageModal from './ImageModal';
import EditPostForm from './EditPostForm';
import { useAuth } from '@/lib/auth';
import { deletePostAction } from '@/app/actions';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isAdmin } = useAuth();
  const router = useRouter();

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
              alt={post.images[0].alt || 'Garden photo'}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPTE+PDYxOjs7QUJCNjdKOzshPVFXR1NJV0JWYWNmY2RKbHRuXGf/2wBDARUXFx4aHR4eHGg7Ojtoa2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2f/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
        )}
        {post.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            +{post.images.length - 1} more
          </div>
        )}
      </div>
      
      <div className="p-4 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {post.title}
            </h2>
            {isAdmin && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  title="Edit post"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={async () => {
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
                  className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                  title="Delete post"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          <time className="text-sm text-gray-500 dark:text-gray-400">
            {format(parseISO(post.date), 'MMM d, yyyy')}
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
        
        {post.tags && post.tags.length > 0 && (
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
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Edit Post</h2>
            </div>
            <EditPostForm
              post={post}
              onClose={() => setIsEditing(false)}
              onSuccess={() => {
                setIsEditing(false);
                router.refresh();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
