'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import ImageUpload from './ImageUpload';
import TagInput from './TagInput';
import ImageThumbnail from './ImageThumbnail';
import type { NewPost, Image as ImageType } from '@/types';
import { FormLayout, FormInput, FormTextarea, FormButton } from './forms';

interface PostFormProps {
  onSubmit: (post: NewPost) => void;
  isSubmitting?: boolean;
}

export default function PostForm({ onSubmit, isSubmitting = false }: PostFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<ImageType[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  // Date field state (datetime-local value)
  const [date, setDate] = useState(() => {
    // Format as yyyy-MM-dd'T'HH:mm for datetime-local
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });

  // When images are uploaded, if first image has timestampTaken, use it
  const handleImagesUploaded = (newImages: ImageType[]) => {
    setImages(prev => [...prev, ...newImages]);
    if (newImages.length > 0 && newImages[0].timestampTaken) {
      // Convert ISO to yyyy-MM-dd'T'HH:mm for input
      const iso = newImages[0].timestampTaken;
      const local = new Date(iso);
      // Pad to 16 chars for datetime-local (no seconds)
      const formatted = local.toISOString().slice(0, 16);
      setDate(formatted);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      notes: notes || undefined,
      date: date ? date : format(new Date(), 'yyyy-MM-dd'),
      images,
      tags,
    });
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <FormLayout onSubmit={handleSubmit}>
      {/* 1. Images - Featured at the top */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upload Images</h2>
        <ImageUpload onImagesUploaded={handleImagesUploaded} />

        {images.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <ImageThumbnail
                  image={image}
                  className="w-full h-32 rounded-lg border-2 border-transparent group-hover:border-emerald-300 transition-all"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
        )}
      </div>

      {/* 2. Date field - Second priority */}
      <FormInput
        id="date"
        type="datetime-local"
        label="Date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />

      {/* 3. Title */}
      <FormInput
        id="title"
        type="text"
        label="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      {/* 4. Tags */}
      <div className="mb-6">
        <TagInput
          value={tags}
          onChange={setTags}
          label="Tags"
          placeholder="Add tags (press Enter, comma, or click to select)"
        />
      </div>

      {/* 5. Description */}
      <FormTextarea
        id="description"
        label="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={3}
        required
      />

      {/* 6. Notes (optional) */}
      <FormTextarea
        id="notes"
        label="Notes (optional)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={6}
      />

      {/* Submit button */}
      <div className="flex justify-end">
        <FormButton type="submit" isLoading={isSubmitting} variant="primary">
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </FormButton>
      </div>
    </FormLayout>
  );
}
