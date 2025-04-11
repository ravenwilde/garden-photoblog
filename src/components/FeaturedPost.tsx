'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Post } from '@/types';
import { format, parseISO } from 'date-fns';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { deletePostAction } from '@/app/actions';
import ImageModal from './ImageModal';
import EditPostForm from './EditPostForm';

interface FeaturedPostProps {
  post: Post;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isAdmin } = useAuth();
  const router = useRouter();
  return (
    <div className="relative w-full h-[60vh] mb-12 group">
      <div 
        className="block w-full h-full cursor-pointer" 
        onClick={() => setIsModalOpen(true)}>
        {/* Image container with gradient overlay */}
        <div className="relative w-full h-full bg-gray-100 dark:bg-gray-800 rounded-xl">
          {post.images?.[0]?.url ? (
            <>
              <Image
                src={post.images[0].url}
                alt={post.images[0].alt || post.title}
                fill
                className="object-cover rounded-xl"
                sizes="(min-width: 1536px) 1536px, 100vw"
                priority
                loading="eager"
                fetchPriority="high"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPTE+PDYxOjs7QUJCNjdKOzshPVFXR1NJV0JWYWNmY2RKbHRuXGf/2wBDARUXFx4aHR4eHGg7Ojtoa2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2f/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
              <p>No image available</p>
            </div>
          )}
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-3xl">
            <time dateTime={post.date} className="block text-sm text-gray-300 mb-4">
              {format(parseISO(post.date), 'MMMM d, yyyy')}
            </time>
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-4xl font-bold group-hover:text-green-400 transition-colors">
                {post.title}
              </h1>
              {isAdmin && (
                <div className="flex items-center gap-2">
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="p-1 text-gray-300 hover:text-indigo-400 transition-colors"
                  title="Edit post"
                >
                  <PencilIcon className="h-6 w-6" />
                </button>
                </div>
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
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit Post</h2>
              <EditPostForm
                post={post}
                onClose={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
                onSuccess={() => {
                  setIsEditing(false);
                  router.refresh();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
