'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeDebug() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="text-black dark:text-white">
        <p>Current theme: {theme}</p>
        <p>Resolved theme: {resolvedTheme}</p>
        <p className="mt-2">
          <span className="inline-block w-4 h-4 mr-2 bg-black dark:bg-white"></span>
          This box should change color with theme
        </p>
      </div>
    </div>
  );
}
