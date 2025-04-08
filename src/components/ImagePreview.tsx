'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  error?: string;
  progress?: number;
}

export default function ImagePreview({ file, onRemove, error, progress }: ImagePreviewProps) {
  const [previewUrl] = useState<string>(() => URL.createObjectURL(file));
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>();
  const [isLoading, setIsLoading] = useState(true);

  // Get formatted file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Load image dimensions
  useEffect(() => {
    const img = new globalThis.Image();
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
      setIsLoading(false);
    };
    img.src = previewUrl;
  }, [previewUrl]);

  return (
    <div className="relative group bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      <div className="aspect-square relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
          </div>
        ) : (
          <Image
            src={previewUrl}
            alt={file.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        
        {/* Progress overlay */}
        {typeof progress === 'number' && progress < 100 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${progress}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        )}

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/80 dark:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
          type="button"
        >
          <XMarkIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Image info */}
      <div className="p-2 text-xs text-gray-600 dark:text-gray-300 space-y-1">
        <div className="truncate" title={file.name}>{file.name}</div>
        <div className="flex justify-between">
          <span>{formatFileSize(file.size)}</span>
          {dimensions && (
            <span>{dimensions.width} × {dimensions.height}px</span>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
          {error}
        </div>
      )}
    </div>
  );
}
