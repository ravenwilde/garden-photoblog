'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types';
import { format, parseISO } from 'date-fns';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { deletePostAction } from '@/app/actions';
import ImageModal from './ImageModal';
import PostFormModal from './PostFormModal';

interface FeaturedPostProps {
  post: Post;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag');
  // Animation state
  const [isVisible, setIsVisible] = useState(true);

  // Effect to handle animation when component mounts or unmounts
  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  return (
    <div
      className={`w-full mb-16 group border-b border-gray-200 dark:border-gray-800 pb-8 transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-10'}`}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-end">
        {/* Right column: Content (on desktop) */}
        <div className="order-2 xl:order-2">
          <time
            dateTime={post.date}
            className="inline-block text-sm font-mono text-emerald-500 mb-4"
          >
            {format(parseISO(post.date), 'MMMM d, yyyy')}
          </time>

          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {post.title}
            </h1>
            {isAdmin && (
              <div className="flex items-center gap-1 ml-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                <button
                  onClick={async e => {
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
                  className="p-1 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Delete post"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="p-1 text-gray-500 hover:text-emerald-500 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Edit post"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6">
            {post.description}
          </p>

          {post.notes && (
            <div className="mb-6 border-l-4 border-emerald-500 pl-4">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Notes:</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{post.notes}</p>
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/?tag=${encodeURIComponent(tag)}`}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    currentTag === tag
                      ? 'bg-emerald-500 text-white'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-800'
                  }`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Left column: Image (on desktop) */}
        <div className="order-1 lg:order-1">
          <div
            className={`relative aspect-[4/3] bg-gray-100 dark:bg-gray-900 ${post.images?.[0]?.url ? 'cursor-pointer' : ''}`}
            onClick={() => post.images?.[0]?.url && setIsModalOpen(true)}
          >
            {post.images?.[0]?.url ? (
              <Image
                src={post.images[0].url}
                alt={post.images[0].alt || post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1023px) 100vw, 50vw"
                priority
                loading="eager"
                fetchPriority="high"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPTE+PDYxOjs7QUJCNjdKOzshPVFXR1NJV0JWYWNmY2RKbHRuXGf/2wBDARUXFx4aHR4eHGg7Ojtoa2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2f/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <p>No image available</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ImageModal images={post.images} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <PostFormModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        post={post}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
