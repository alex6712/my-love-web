import { COMPRESSION_CONFIG } from '../constants/media';

function isImageType(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

function changeFileExtension(filename: string, newExt: string): string {
  const dotIndex = filename.lastIndexOf('.');
  const base = dotIndex > 0 ? filename.substring(0, dotIndex) : filename;
  return `${base}${newExt}`;
}

function calculateDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  const ratio = Math.min(maxWidth / width, maxHeight / height);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

export function shouldCompress(file: File): boolean {
  if (!isImageType(file.type)) {
    return false;
  }

  if (file.size <= COMPRESSION_CONFIG.SKIP_COMPRESS_BYTES) {
    return false;
  }

  return true;
}

export async function compressImage(file: File): Promise<File> {
  if (!shouldCompress(file)) {
    return file;
  }

  let bitmap: ImageBitmap | null = null;
  let canvas: HTMLCanvasElement | null = null;

  try {
    bitmap = await createImageBitmap(file);

    const { width, height } = calculateDimensions(
      bitmap.width,
      bitmap.height,
      COMPRESSION_CONFIG.IMAGE_MAX_WIDTH,
      COMPRESSION_CONFIG.IMAGE_MAX_HEIGHT,
    );

    const needsResize = width !== bitmap.width || height !== bitmap.height;

    if (
      !needsResize &&
      file.type === COMPRESSION_CONFIG.IMAGE_OUTPUT_MIME &&
      file.size <= COMPRESSION_CONFIG.IMAGE_TARGET_MAX_BYTES
    ) {
      return file;
    }

    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    bitmap = null;

    let quality = COMPRESSION_CONFIG.IMAGE_QUALITY;

    while (quality >= COMPRESSION_CONFIG.IMAGE_MIN_QUALITY) {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas!.toBlob(resolve, COMPRESSION_CONFIG.IMAGE_OUTPUT_MIME, quality),
      );

      if (!blob) {
        return file;
      }

      if (
        blob.size <= COMPRESSION_CONFIG.IMAGE_TARGET_MAX_BYTES ||
        quality <= COMPRESSION_CONFIG.IMAGE_MIN_QUALITY
      ) {
        const newName = changeFileExtension(file.name, COMPRESSION_CONFIG.IMAGE_OUTPUT_EXT);

        if (blob.size >= file.size) {
          return file;
        }

        return new File([blob], newName, { type: COMPRESSION_CONFIG.IMAGE_OUTPUT_MIME });
      }

      quality = Math.round((quality - COMPRESSION_CONFIG.IMAGE_QUALITY_STEP) * 100) / 100;
    }

    return file;
  } finally {
    if (bitmap) {
      bitmap.close();
    }
  }
}
