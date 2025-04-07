'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/lib/types';
import { format } from 'date-fns';

interface FeaturedPostProps {
  post: Post;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <div className="relative w-full h-[60vh] mb-12 group">
      <Link href={`/posts/${post.id}`} className="block w-full h-full">
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
            <h1 className="text-4xl font-bold mb-4 group-hover:text-green-400 transition-colors">
              {post.title}
            </h1>
            <p className="text-lg text-gray-200 mb-4 line-clamp-2">
              {post.description}
            </p>
            <div className="flex items-center text-sm text-gray-300">
              <time dateTime={post.date}>
                {format(new Date(post.date), 'MMMM d, yyyy')}
              </time>
              <span className="mx-2">·</span>
              <span className="text-green-400">Featured Post</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
