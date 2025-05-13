'use client';

import React from 'react';

interface FormLayoutProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
  error?: string;
}

export default function FormLayout({ children, onSubmit, className = '', error }: FormLayoutProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`} role="form">
      {error && (
        <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-800">
          {error}
        </div>
      )}
      {children}
    </form>
  );
}
