'use client';

import { useState, useEffect } from 'react';
import type { Tag } from '@/lib/tags';

interface TagManagerProps {
  className?: string;
}

export default function TagManager({ className = '' }: TagManagerProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      setError('Failed to load tags');
      console.error('Error fetching tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setEditName(tag.name);
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditName('');
    setError('');
  };

  const handleUpdate = async () => {
    if (!editingTag || !editName.trim()) return;

    try {
      const response = await fetch(`/api/tags/${editingTag.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update tag');
      }

      await fetchTags();
      handleCancelEdit();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (!confirm(`Are you sure you want to delete the tag "${tag.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/tags/${tag.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update tag');
      }

      await fetchTags();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  if (isLoading) {
    return <div className={className}>Loading tags...</div>;
  }

  return (
    <div className={className}>
      {error && (
        <div className="mb-4 p-2 text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {tags.map(tag => (
          <div
            key={tag.id}
            className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            {editingTag?.id === tag.id ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  onClick={handleUpdate}
                  className="px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div>
                  <span className="font-medium">{tag.name}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({tag.post_count} {tag.post_count === 1 ? 'post' : 'posts'})
                  </span>
                </div>
                <div className="flex gap-2">
                  {tag.post_count === 0 && (
                    <button
                      onClick={() => handleDelete(tag)}
                      className="p-1 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      title="Delete tag"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(tag)}
                    className="p-1 text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                    title="Edit tag"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
