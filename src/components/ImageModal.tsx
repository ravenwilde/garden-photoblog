'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Image as ImageType } from '@/types';

interface ImageModalProps {
  images: ImageType[];
  isOpen: boolean;
  onClose: () => void;
  initialImageIndex?: number;
}

export default function ImageModal({
  images,
  isOpen,
  onClose,
  initialImageIndex = 0,
}: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Memoize the adjacent indices calculation
  const adjacentIndices = useMemo(() => {
    if (!images.length) return { nextIndex: 0, prevIndex: 0 };
    return {
      nextIndex: currentIndex === images.length - 1 ? 0 : currentIndex + 1,
      prevIndex: currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    };
  }, [currentIndex, images.length]);

  // Memoize the preload function
  const preloadImage = useCallback((url: string) => {
    const img = new window.Image();
    img.src = url;
  }, []);

  // Preload adjacent images when modal is open or current index changes
  useEffect(() => {
    if (isOpen && images.length > 1) {
      const { nextIndex, prevIndex } = adjacentIndices;
      preloadImage(images[nextIndex].url);
      preloadImage(images[prevIndex].url);
    }
  }, [isOpen, currentIndex, adjacentIndices, preloadImage, images]);

  // Reset loading state when current image changes
  useEffect(() => {
    setIsImageLoading(true);
  }, [currentIndex]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  // Use createPortal to render the modal at the document root
  return createPortal(
    <div
      className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <button
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 p-4 text-white hover:text-gray-300 z-10 rounded-full hover:bg-white/10 transition-colors cursor-pointer group"
          aria-label="Close modal"
        >
          <div className="absolute -inset-1 md:-inset-2 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <svg className="w-6 h-6 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={e => {
                e.stopPropagation();
                setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
              }}
              className="absolute left-4 p-4 text-white hover:text-gray-300 z-10 rounded-full hover:bg-white/10 transition-colors cursor-pointer group"
              aria-label="Previous image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-4 p-4 text-white hover:text-gray-300 z-10 rounded-full hover:bg-white/10 transition-colors cursor-pointer group"
              aria-label="Next image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        <div className="relative w-full h-full" onClick={e => e.stopPropagation()}>
          <div className="relative w-full h-full">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-white transition ease-in-out duration-150 cursor-wait">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading image...
                </div>
              </div>
            )}
            <Image
              src={currentImage.url}
              alt={currentImage.alt || 'Garden photo'}
              fill
              className="object-contain"
              sizes="(min-width: 1920px) 1920px, 100vw"
              priority
              loading="eager"
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPTE+PDYxOjs7QUJCNjdKOzshPVFXR1NJV0JWYWNmY2RKbHRuXGf/2wBDARUXFx4aHR4eHGg7Ojtoa2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2f/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              onLoadingComplete={() => setIsImageLoading(false)}
            />
          </div>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
