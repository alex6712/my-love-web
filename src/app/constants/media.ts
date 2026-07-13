export const MEDIA_CONFIG = {
  MAX_FILE_SIZE_BYTES: 500 * 1024 * 1024,
  SUPPORTED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/quicktime',
  ] as const,
} as const;

export const COMPRESSION_CONFIG = {
  IMAGE_MAX_WIDTH: 1920,
  IMAGE_MAX_HEIGHT: 1080,
  IMAGE_QUALITY: 0.85,
  IMAGE_TARGET_MIN_BYTES: 500 * 1024,
  IMAGE_TARGET_MAX_BYTES: 1 * 1024 * 1024,
  IMAGE_MIN_QUALITY: 0.3,
  IMAGE_QUALITY_STEP: 0.1,
  IMAGE_OUTPUT_MIME: 'image/jpeg' as const,
  IMAGE_OUTPUT_EXT: '.jpg',
  SKIP_COMPRESS_BYTES: 100 * 1024,
  VIDEO_WARN_SIZE_BYTES: 100 * 1024 * 1024,
} as const;

export type SupportedMediaType = (typeof MEDIA_CONFIG.SUPPORTED_TYPES)[number];

export function isSupportedType(mimeType: string): mimeType is SupportedMediaType {
  return MEDIA_CONFIG.SUPPORTED_TYPES.includes(mimeType as SupportedMediaType);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + ' B';
  }
  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  }
  if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}
