'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import ImageModal from './ImageModal';
import PostFormModal from './PostFormModal';
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
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag');

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full flex flex-col">
      <div className="relative h-52 bg-gray-100 dark:bg-gray-800">
        <div
          className={`relative w-full h-full ${post.images?.[0]?.url ? 'cursor-pointer' : ''}`}
          onClick={() => post.images?.[0]?.url && setIsModalOpen(true)}
        >
          {post.images?.[0]?.url ? (
            <Image
              src={post.images[0].url}
              alt={post.images[0].alt || 'Garden photo'}
              fill
              className="object-cover hover:opacity-90 transition-opacity duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              loading="lazy"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPTE+PDYxOjs7QUJCNjdKOzshPVFXR1NJV0JWYWNmY2RKbHRuXGf/2wBDARUXFx4aHR4eHGg7Ojtoa2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2f/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
              <p>No image available</p>
            </div>
          )}
        </div>
        {post.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            +{post.images.length - 1} more
          </div>
        )}
      </div>

      <div className="p-4 relative flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 font-sans">
              {post.title}
            </h2>
            {isAdmin && (
              <div className="flex items-center">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-0.5 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
                  title="Edit post"
                >
                  <PencilSquareIcon className="h-4 w-4" />
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
                  className="p-0.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                  title="Delete post"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          <time className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {format(parseISO(post.date), 'MMM d, yyyy')}
          </time>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm line-clamp-2">
          {post.description}
        </p>

        {post.notes && (
          <div className="mb-2">
            <h3 className="text-xs font-medium text-gray-900 dark:text-white mb-0.5">Notes:</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{post.notes}</p>
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {post.tags.map(tag => (
              <Link
                key={tag}
                href={`/?tag=${encodeURIComponent(tag)}`}
                className={`px-2 py-1 rounded-full text-xs transition-colors ${
                  currentTag === tag
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-800'
                }`}
                onClick={e => {
                  // If we're already on a tag page, use client-side navigation
                  if (window.location.pathname.startsWith('/tags/')) {
                    e.preventDefault();
                    router.push(`/?tag=${encodeURIComponent(tag)}`);
                  }
                }}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      <ImageModal images={post.images} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <PostFormModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        post={post}
        title="Edit Post"
        onSuccess={() => {
          setIsEditing(false);
          router.refresh();
        }}
      />
    </div>
  );
}
