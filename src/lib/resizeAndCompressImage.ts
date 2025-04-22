// Utility to resize and compress images client-side using Canvas API
// Returns a new File suitable for upload

export interface ResizeOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number; // 0..1
  type?: string; // e.g., 'image/jpeg' or 'image/webp'
}

import * as exifr from 'exifr';

export interface ImageWithTimestamp {
  file: File;
  timestampTaken?: string;
}

export async function resizeAndCompressImage(
  file: File,
  options: ResizeOptions
): Promise<ImageWithTimestamp> {
  // Extract timestamp from EXIF before resizing
  let timestampTaken: string | undefined;
  try {
    const exif = await exifr.parse(file, { translateValues: false });
    if (exif) {
      // Prefer DateTimeOriginal, fallback to DateTime
      const date = exif.DateTimeOriginal || exif.DateTime || exif.CreateDate;
      if (date instanceof Date) {
        timestampTaken = date.toISOString();
      } else if (typeof date === 'string') {
        // Try to parse string date
        const parsed = new Date(date);
        if (!isNaN(parsed.getTime())) {
          timestampTaken = parsed.toISOString();
        }
      }
    }
  } catch (e) {
    // Ignore EXIF parse errors, continue without timestamp
  }

  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      let { width, height } = img;
      const { maxWidth, maxHeight, quality, type = 'image/jpeg' } = options;
      // Calculate new dimensions while preserving aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error('Canvas context error'));
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            URL.revokeObjectURL(url);
            return reject(new Error('Compression failed'));
          }
          // Remove personally identifying EXIF metadata (e.g., geolocation) by not copying any EXIF to the new file
          // and preserve the original lastModified timestamp
          const newFile = new File([blob], file.name, { type, lastModified: file.lastModified });
          resolve({ file: newFile, timestampTaken });
          URL.revokeObjectURL(url);
        },
        type,
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image failed to load'));
    };
    img.src = url;
  });
}
