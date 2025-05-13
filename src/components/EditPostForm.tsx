'use client';

import { useState } from 'react';
import TagInput from './TagInput';
import type { Post, Image as ImageType } from '@/types';
import { getCsrfToken } from '@/lib/csrf-client';
import ImageUpload from './ImageUpload';
import ImageThumbnail from './ImageThumbnail';
import { FormLayout, FormInput, FormTextarea, FormButton } from './forms';

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
    tags: post.tags || [],
  });

  // Image management state
  const [existingImages, setExistingImages] = useState<ImageType[]>(post.images || []);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<ImageType[]>([]); // These are local image objects (after upload)

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
          'x-csrf-token': token,
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
    <FormLayout onSubmit={handleSubmit} className="p-4">
      {/* 1. Images Section - Featured at the top */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Images</h2>

        {/* Existing images grid */}
        {existingImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {existingImages.map(img => (
              <div
                key={img.id || img.url}
                className="relative group border-2 border-transparent hover:border-emerald-300 rounded-lg overflow-hidden transition-all"
              >
                <ImageThumbnail image={img} className="w-full h-32" />
                <button
                  type="button"
                  title="Remove image"
                  onClick={() => handleRemoveImage(img)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            No images attached to this post.
          </div>
        )}

        {/* New image upload */}
        <div className="mb-2">Add more images:</div>
        <ImageUpload onImagesUploaded={handleImagesUploaded} />

        {/* Show newly added images (pre-uploaded) */}
        {newImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {newImages.map((img, idx) => (
              <div
                key={img.url + idx}
                className="relative border-2 border-emerald-200 rounded-lg overflow-hidden"
              >
                <ImageThumbnail image={img} className="w-full h-32" />
                <div className="absolute bottom-0 inset-x-0 bg-emerald-100 dark:bg-emerald-900 text-xs text-emerald-800 dark:text-emerald-200 py-1 px-2">
                  New image
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Date field - Second priority */}
      <FormInput
        id="date"
        type="date"
        label="Date"
        value={formData.date}
        onChange={e => setFormData({ ...formData, date: e.target.value })}
        required
      />

      {/* 3. Title */}
      <FormInput
        id="title"
        type="text"
        label="Title"
        value={formData.title}
        onChange={e => setFormData({ ...formData, title: e.target.value })}
        required
      />

      {/* 4. Tags */}
      <div className="mb-6">
        <TagInput
          value={formData.tags}
          onChange={tags => setFormData({ ...formData, tags })}
          label="Tags"
          placeholder="Add a tag"
        />
      </div>

      {/* 5. Description */}
      <FormTextarea
        id="description"
        label="Description"
        value={formData.description}
        onChange={e => setFormData({ ...formData, description: e.target.value })}
        rows={3}
        required
      />

      {/* 6. Notes (optional) */}
      <FormTextarea
        id="notes"
        label="Notes (optional)"
        value={formData.notes}
        onChange={e => setFormData({ ...formData, notes: e.target.value })}
        rows={4}
      />

      {/* Action buttons */}
      <div className="flex justify-end gap-4">
        <FormButton type="button" onClick={onClose} variant="secondary">
          Cancel
        </FormButton>
        <FormButton type="submit" isLoading={isSubmitting} variant="primary">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </FormButton>
      </div>
    </FormLayout>
  );
}
