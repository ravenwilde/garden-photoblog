'use client';

import { useState } from 'react';
// import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import type { Post } from '@/types';

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
  const [tagInput, setTagInput] = useState('');

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData({ ...formData, tags: [...formData.tags, newTag] });
      }
      setTagInput('');
    }
  };

  const removeTag = async (tagToRemove: string) => {
    const newTags = formData.tags.filter(tag => tag !== tagToRemove);
    await Promise.resolve(); // Ensure state update is handled asynchronously
    setFormData({
      ...formData,
      tags: newTags
    });
  };
  useRouter(); // Keep router initialized for future use

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Title
        </label>
        <input
          type="text"
          id="title"
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

      <div>
        <label htmlFor="tag-input" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Tags
        </label>
        <div className="mt-1">
          <input
            id="tag-input"
            type="text"
            placeholder="Add a tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
          />
        </div>
        {formData.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100"
              >
                {tag}
                <button
                  type="button"
                  onClick={async () => await removeTag(tag)}
                  className="ml-1 hover:text-indigo-600 dark:hover:text-indigo-400"
                  aria-label="remove tag"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

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
