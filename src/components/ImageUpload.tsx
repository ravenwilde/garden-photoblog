'use client';

import { useState, useCallback, useRef } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import ImagePreview from './ImagePreview';
import type { Image as ImageType } from '@/types';

interface ImageUploadProps {
  onImagesUploaded: (images: ImageType[]) => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  error?: string;
}

export default function ImageUpload({ onImagesUploaded }: ImageUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    // Validate files
    const newFiles = Array.from(files).filter(file => {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        console.error('Invalid file type:', file.type);
        return false;
      }
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        console.error('File too large:', file.size);
        return false;
      }
      return true;
    });

    if (newFiles.length === 0) return;

    // Add files to uploading state
    setUploadingFiles(prev => [
      ...prev,
      ...newFiles.map(file => ({ file, progress: 0 }))
    ]);

    // Upload each file
    const uploadedImages: ImageType[] = [];

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        console.log('Uploading file:', {
          name: file.name,
          type: file.type,
          size: file.size
        });

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload image');
        }

        // Update progress
        setUploadingFiles(prev => prev.map((f, index) => 
          f.file === file ? { ...f, progress: 100 } : f
        ));

        uploadedImages.push(data);
        console.log('Upload successful:', data);

      } catch (error) {
        console.error('Upload error:', error instanceof Error ? error.message : error);
        setUploadingFiles(prev => prev.map((f) => 
          f.file === file ? { ...f, error: error instanceof Error ? error.message : 'Upload failed' } : f
        ));
      }
    }

    if (uploadedImages.length > 0) {
      onImagesUploaded(uploadedImages);
    }

    // Clean up successful uploads after a delay
    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(f => f.progress !== 100));
    }, 2000);
  }, [onImagesUploaded]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    handleFiles(files);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    handleFiles(files);
  }, [handleFiles]);

  const removeFile = useCallback((fileToRemove: File) => {
    setUploadingFiles(prev => prev.filter(f => f.file !== fileToRemove));
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={uploadingFiles.some(f => f.progress < 100)}
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <PhotoIcon className="w-8 h-8 text-gray-400" />
          <div className="text-sm text-center">
            <span className="text-gray-600 dark:text-gray-400">
              Drag and drop your images here, or{' '}
              <button
                type="button"
                onClick={handleBrowseClick}
                className="text-green-600 dark:text-green-400 hover:underline focus:outline-none"
              >
                browse
              </button>
            </span>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Maximum file size: 10MB
            </div>
          </div>
        </div>

        {isDragging && (
          <div className="absolute inset-0 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <div className="text-green-600 dark:text-green-400 font-medium">
              Drop your images here
            </div>
          </div>
        )}
      </div>

      {/* Preview grid */}
      {uploadingFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {uploadingFiles.map(({ file, progress, error }) => (
            <ImagePreview
              key={`${file.name}-${file.lastModified}`}
              file={file}
              progress={progress}
              error={error}
              onRemove={() => removeFile(file)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
