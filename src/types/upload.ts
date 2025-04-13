export enum UploadErrorType {
  EXIF_CLEAN_FAILED = 'EXIF_CLEAN_FAILED',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  INVALID_FILE = 'INVALID_FILE'
}

export interface UploadError {
  type: UploadErrorType;
  message: string;
}
