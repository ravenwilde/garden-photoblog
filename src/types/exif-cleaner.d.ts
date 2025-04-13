declare module 'exif-cleaner' {
  interface ExifData {
    // Common EXIF tags
    Make?: string;
    Model?: string;
    DateTimeOriginal?: string;
    GPSLatitude?: number[];
    GPSLongitude?: number[];
    GPSAltitude?: number;
    ImageDescription?: string;
    Copyright?: string;
    Artist?: string;
    Software?: string;
    // Allow for other EXIF tags while maintaining type safety
    [key: string]: string | number | number[] | undefined;
  }

  function readFile(inputPath: string): Promise<Buffer>;
  function parse(buffer: Buffer): ExifData;
  function clean(buffer: Buffer): Promise<Buffer>;
  function writeFile(outputPath: string, buffer: Buffer): Promise<void>;
  
  export { readFile, parse, clean, writeFile, ExifData };
}
