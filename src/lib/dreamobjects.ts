import crypto from 'crypto';

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

    // Convert ArrayBuffer to Buffer for consistent handling
    const bufferData = Buffer.from(buffer);
    
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

export async function deleteImage(key: string) {
  // Implementation for deleting images if needed
  // This would use the DeleteObjectCommand from AWS SDK
}
