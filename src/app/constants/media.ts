export const MEDIA_CONFIG = {
  MAX_FILE_SIZE_BYTES: 500 * 1024 * 1024,
  SUPPORTED_TYPES: [
    'image/jpeg',
    'image/png',
    'video/mp4',
    'video/quicktime',
  ] as const,
} as const;

export type SupportedMediaType = typeof MEDIA_CONFIG.SUPPORTED_TYPES[number];

export function isSupportedType(mimeType: string): mimeType is SupportedMediaType {
  return MEDIA_CONFIG.SUPPORTED_TYPES.includes(mimeType as SupportedMediaType);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}
