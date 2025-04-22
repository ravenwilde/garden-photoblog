'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TagInput from './TagInput';
import type { Post, Image as ImageType } from '@/types';
import { getCsrfToken } from '@/lib/csrf-client';
import ImageUpload from './ImageUpload';

interface EditPostFormProps {
  post: Post;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditPostForm({ post, onClose, onSuccess }: EditPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: post.title,
    description: post.description,
    date: post.date,
    notes: post.notes || '',
    tags: post.tags || []
  });

  // Image management state
  const [existingImages, setExistingImages] = useState<ImageType[]>(post.images || []);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<ImageType[]>([]); // These are local image objects (after upload)

  useRouter();

  // Remove image handler
  const handleRemoveImage = (img: ImageType) => {
    if (img.id) {
      setImagesToRemove(prev => [...prev, img.id!]);
      setExistingImages(prev => prev.filter(i => i.id !== img.id));
    }
  };

  // Add new images handler
  const handleImagesUploaded = (uploaded: ImageType[]) => {
    setNewImages(prev => [...prev, ...uploaded]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = await getCsrfToken();
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': token
        },
        body: JSON.stringify({
          ...formData,
          imagesToRemove,
          newImages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update post');
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4" role="form">
      {/* Images Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Images
        </label>
        {/* Existing images grid */}
        {existingImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            {existingImages.map(img => (
              <div key={img.id || img.url} className="relative group border rounded overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt || ''}
                  className="object-cover w-full h-32"
                />
                <button
                  type="button"
                  title="Remove image"
                  onClick={() => handleRemoveImage(img)}
                  className="absolute top-1 right-1 bg-white/80 hover:bg-red-500 hover:text-white rounded-full p-1 text-sm shadow"
                >
                  <span aria-hidden>🗑️</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500 mb-2">No images attached to this post.</div>
        )}
        {/* New image upload */}
        <ImageUpload onImagesUploaded={handleImagesUploaded} />
        {/* Show newly added images (pre-uploaded) */}
        {newImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {newImages.map((img, idx) => (
              <div key={img.url + idx} className="relative border rounded overflow-hidden opacity-70">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt || ''}
                  className="object-cover w-full h-32"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Notes
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
        />
      </div>

      {/* Tag input */}
      <TagInput
        value={formData.tags}
        onChange={tags => setFormData({ ...formData, tags })}
        label="Tags"
        placeholder="Add a tag"
      />

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
