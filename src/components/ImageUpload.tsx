'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Image as ImageType } from '@/types';

interface ImageUploadProps {
  onImagesUploaded: (images: ImageType[]) => void;
}

export default function ImageUpload({ onImagesUploaded }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    const uploadedImages: ImageType[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        console.log('Uploading file:', {
          name: file.name,
          type: file.type,
          size: file.size
        });

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response text:', responseText);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse response:', e);
          throw new Error('Invalid response from server');
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload image');
        }

        uploadedImages.push(data);
        console.log('Upload successful:', data);

        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      onImagesUploaded(uploadedImages);
    } catch (error) {
      console.error('Upload error:', error instanceof Error ? error.message : error);
      setError(error instanceof Error ? error.message : 'Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full space-y-2">
      <label className="block w-full">
        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
          <div className="text-center">
            {isUploading ? (
              <div className="space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Uploading... {Math.round(uploadProgress)}%
                </div>
                <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <svg
                  className="mx-auto h-8 w-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload images
                </div>
              </div>
            )}
          </div>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={isUploading}
        />
      </label>
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
