'use client';

import { useState } from 'react';
import Modal from './Modal';
import PostForm from './PostForm';
import EditPostForm from './EditPostForm';
import type { Post, NewPost } from '@/types';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (post?: NewPost) => void | Promise<void>;
  post?: Post; // If provided, we're editing an existing post
  title?: string;
}

export default function PostFormModal({
  isOpen,
  onClose,
  onSuccess,
  post,
  title,
}: PostFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine if we're creating a new post or editing an existing one
  const isEditing = !!post;

  // Default title based on mode
  const modalTitle = title || (isEditing ? 'Edit Post' : 'Create New Post');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="lg">
      {isEditing ? (
        <EditPostForm
          post={post}
          onClose={onClose}
          onSuccess={() => {
            onSuccess?.();
            onClose();
          }}
        />
      ) : (
        <PostForm
          onSubmit={async (newPost: NewPost) => {
            setIsSubmitting(true);
            try {
              // Pass the new post data to the parent component's onSuccess handler
              if (onSuccess) {
                await onSuccess(newPost);
              }
            } catch (error) {
              console.error('Error submitting post:', error);
              alert('Failed to create post. Please try again.');
            } finally {
              setIsSubmitting(false);
              onClose();
            }
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </Modal>
  );
}
