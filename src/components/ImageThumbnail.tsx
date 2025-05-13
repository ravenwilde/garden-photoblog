'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { Image as ImageType } from '@/types';

interface ImageThumbnailProps {
  image: ImageType;
  className?: string;
}

export default function ImageThumbnail({ image, className = '' }: ImageThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!hasError ? (
        <Image
          src={image.url}
          alt={image.alt || 'Garden photo'}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={true}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">Image unavailable</span>
        </div>
      )}
    </div>
  );
}
