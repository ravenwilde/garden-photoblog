import crypto from 'crypto';
import exifCleaner from 'exif-cleaner';

if (!process.env.DREAMOBJECTS_ACCESS_KEY) {
  throw new Error('DREAMOBJECTS_ACCESS_KEY is not set');
}
if (!process.env.DREAMOBJECTS_SECRET_KEY) {
  throw new Error('DREAMOBJECTS_SECRET_KEY is not set');
}
if (!process.env.DREAMOBJECTS_BUCKET_NAME) {
  throw new Error('DREAMOBJECTS_BUCKET_NAME is not set');
}

const BUCKET_NAME = process.env.DREAMOBJECTS_BUCKET_NAME;
const ACCESS_KEY = process.env.DREAMOBJECTS_ACCESS_KEY;
const SECRET_KEY = process.env.DREAMOBJECTS_SECRET_KEY;
const ENDPOINT = 'https://s3.us-east-005.dream.io';
const REGION = 'us-east-005';
const SERVICE = 's3';

console.log('DreamObjects configuration:', {
  bucket: BUCKET_NAME,
  accessKeyLength: ACCESS_KEY.length,
  secretKeyLength: SECRET_KEY.length,
  endpoint: ENDPOINT,
  region: REGION
});

export interface UploadedImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

function hmac(key: Buffer | string, string: string): Buffer {
  return crypto.createHmac('sha256', key).update(string).digest();
}

function hash(data: string | Buffer | ArrayBuffer): string {
  let input: Buffer;
  if (Buffer.isBuffer(data)) {
    input = data;
  } else if (data instanceof ArrayBuffer) {
    input = Buffer.from(data);
  } else {
    input = Buffer.from(data, 'utf-8');
  }
  return crypto.createHash('sha256').update(input).digest('hex');
}

function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Buffer {
  const kDate = hmac('AWS4' + key, dateStamp);
  const kRegion = hmac(kDate, regionName);
  const kService = hmac(kRegion, serviceName);
  const kSigning = hmac(kService, 'aws4_request');
  return kSigning;
}

export function getSignedImageUrl(imageKey: string, expiresIn: number = 3600): string {
  const timestamp = new Date();
  const dateStamp = timestamp.toISOString().split('T')[0].replace(/-/g, '');
  const amzDate = dateStamp + 'T' + timestamp.toISOString().split('T')[1].replace(/:/g, '').split('.')[0] + 'Z';

  const credential = `${ACCESS_KEY}/${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  
  const queryParams = new URLSearchParams({
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': credential,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': expiresIn.toString(),
    'X-Amz-SignedHeaders': 'host'
  });

  const canonicalUri = `/${imageKey}`;
  const canonicalQueryString = queryParams.toString();
  const canonicalHeaders = `host:${BUCKET_NAME}.s3.${REGION}.dream.io\n`;
  const signedHeaders = 'host';

  const canonicalRequest = [
    'GET',
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    'UNSIGNED-PAYLOAD'
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    `${dateStamp}/${REGION}/${SERVICE}/aws4_request`,
    hash(canonicalRequest)
  ].join('\n');

  const signingKey = getSignatureKey(SECRET_KEY, dateStamp, REGION, SERVICE);
  const signature = crypto.createHmac('sha256', signingKey)
    .update(stringToSign)
    .digest('hex');

  queryParams.append('X-Amz-Signature', signature);
  
  return `https://${BUCKET_NAME}.s3.${REGION}.dream.io${canonicalUri}?${queryParams.toString()}`;
}

class ExifCleaningError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExifCleaningError';
  }
}

interface ExifResult {
  buffer: Buffer;
  hadExif: boolean;
  cleaned: boolean;
}

async function processExifData(buffer: ArrayBuffer): Promise<ExifResult> {
  try {
    // Convert ArrayBuffer to Buffer for exif-cleaner
    const inputBuffer = Buffer.from(buffer);
    
    let hasExifData = false;
    // Parse and check for EXIF data
    try {
      const exifData = exifCleaner.parse(inputBuffer);
      if (Object.keys(exifData).length > 0) {
        hasExifData = true;
        console.log('EXIF data found:', exifData);
      } else {
        console.log('No EXIF data found in image');
        return { buffer: inputBuffer, hadExif: false, cleaned: false };
      }
    } catch (exifError) {
      console.log('No EXIF data found or error parsing:', exifError instanceof Error ? exifError.message : exifError);
      return { buffer: inputBuffer, hadExif: false, cleaned: false };
    }
    
    // If we found EXIF data, try to clean it
    if (hasExifData) {
      try {
        const cleanedBuffer = await exifCleaner.clean(inputBuffer);
        console.log('EXIF data cleaned successfully');
        return { buffer: cleanedBuffer, hadExif: true, cleaned: true };
      } catch (cleanError) {
        console.error('Failed to clean EXIF data:', cleanError instanceof Error ? cleanError.message : cleanError);
        throw new ExifCleaningError('Found EXIF data but failed to clean it. For privacy reasons, the upload has been cancelled.');
      }
    }
    
    // This case should never happen as we return early if no EXIF data is found
    return { buffer: inputBuffer, hadExif: false, cleaned: false };
  } catch (error) {
    console.error('Error cleaning EXIF data:', error instanceof Error ? error.message : error);
    throw new ExifCleaningError('Failed to clean EXIF data from image. For privacy reasons, the upload has been cancelled.');
  }
}

export async function uploadImage(file: File): Promise<UploadedImage> {
  try {
    const buffer = await file.arrayBuffer();
    const timestamp = Date.now();
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
    const key = `images/${timestamp}-${filename}`;

    console.log('Uploading to DreamObjects:', {
      bucket: BUCKET_NAME,
      key: key,
      contentType: file.type,
      endpoint: ENDPOINT,
      fileSize: buffer.byteLength
    });

    // Create dates for signing
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:\-]|\.[0-9]{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);

    // Process EXIF data
    const { buffer: processedBuffer, hadExif, cleaned } = await processExifData(buffer);
    if (hadExif) {
      console.log('Image had EXIF data and was', cleaned ? 'cleaned successfully' : 'not cleaned');
    }
    const bufferData = processedBuffer;
    
    // Create canonical request
    const contentType = file.type;
    const payloadHash = hash(bufferData);
    const canonicalUri = `/${BUCKET_NAME}/${key}`;
    const canonicalQueryString = '';
    const contentLength = bufferData.length;
    const canonicalHeaders = [
      `content-length:${contentLength}`,
      `content-type:${contentType}`,
      `host:s3.us-east-005.dream.io`,
      `x-amz-content-sha256:${payloadHash}`,
      `x-amz-date:${amzDate}`,
    ].join('\n') + '\n';
    const signedHeaders = 'content-length;content-type;host;x-amz-content-sha256;x-amz-date';
    const canonicalRequest = [
      'PUT',
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join('\n');

    // Create string to sign
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      hash(canonicalRequest)
    ].join('\n');

    // Calculate signature
    const signingKey = getSignatureKey(SECRET_KEY, dateStamp, REGION, SERVICE);
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

    // Create authorization header
    const authorization = [
      `${algorithm} Credential=${ACCESS_KEY}/${credentialScope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`
    ].join(', ');

    const url = `${ENDPOINT}/${BUCKET_NAME}/${key}`;
    console.log('Upload URL:', url);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Length': contentLength.toString(),
          'Content-Type': contentType,
          'x-amz-content-sha256': payloadHash,
          'x-amz-date': amzDate,
          'Authorization': authorization,
        },
        body: bufferData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upload failed: ${response.status} ${response.statusText}\n${text}`);
      }

      console.log('Upload successful:', response.status, response.statusText);
      
      // DreamObjects URL format from bucket settings
      const publicUrl = `https://${BUCKET_NAME}.s3.us-east-005.dream.io/${key}`;
      console.log('Generated URL:', publicUrl);

      return {
        url: publicUrl,
        alt: filename.split('.')[0],
        width: 1200,
        height: 800,
      };
    } catch (uploadError) {
      console.error('Upload error:', {
        error: uploadError,
        message: uploadError instanceof Error ? uploadError.message : 'Unknown error',
        url: url,
        bucket: BUCKET_NAME,
        key: key
      });
      throw uploadError;
    }
  } catch (error) {
    console.error('DreamObjects upload error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
