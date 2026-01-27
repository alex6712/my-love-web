import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  MEDIA_CONFIG,
  formatFileSize,
  isSupportedType,
} from "../constants/media";
import { API_URL } from "../constants/api";

function generateIdempotencyKey(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface UploadProgress {
  id: string;
  fileName: string;
  fileSize: number;
  progress: number;
  status: "pending" | "uploading" | "confirming" | "completed" | "error";
  error?: string;
}

interface UseFileUploadOptions {
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

interface UseFileUploadReturn {
  uploads: UploadProgress[];
  uploadFile: (
    file: File,
    title: string,
    description?: string,
  ) => Promise<string>;
  uploadFiles: (files: FileList, defaultTitle?: string) => Promise<string[]>;
  removeUpload: (id: string) => void;
  clearCompleted: () => void;
  isUploading: boolean;
}

export function useFileUpload(
  options?: UseFileUploadOptions,
): UseFileUploadReturn {
  const authenticatedFetch = options?.authenticatedFetch;
  const fetchWithAuth = authenticatedFetch || fetch.bind(undefined);

  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const createUploadState = (file: File): UploadProgress => ({
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fileName: file.name,
    fileSize: file.size,
    progress: 0,
    status: "pending",
  });

  const updateUpload = (id: string, updates: Partial<UploadProgress>) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === id ? { ...upload, ...updates } : upload,
      ),
    );
  };

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((upload) => upload.id !== id));
  };

  const clearCompleted = () => {
    setUploads((prev) =>
      prev.filter((upload) => upload.status !== "completed"),
    );
  };

  const getPresignedUrl = async (
    contentType: string,
    title: string,
    description?: string,
  ): Promise<{ file_id: string; presigned_url: string }> => {
    const token = localStorage.getItem("access_token");
    const idempotencyKey = generateIdempotencyKey();
    const response = await fetchWithAuth(`${API_URL}/v1/media/files/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        content_type: contentType,
        title,
        description: description || null,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to get upload URL");
    }

    const data = await response.json();
    return { file_id: data.url.file_id, presigned_url: data.url.presigned_url };
  };

  const uploadToS3 = (
    presignedUrl: string,
    file: File,
    onProgress: (progress: number) => void,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.addEventListener("timeout", () => {
        reject(new Error("Upload timed out"));
      });

      xhr.open("PUT", presignedUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  };

  const confirmUpload = async (fileId: string): Promise<void> => {
    const token = localStorage.getItem("access_token");
    const idempotencyKey = generateIdempotencyKey();
    const response = await fetchWithAuth(
      `${API_URL}/v1/media/files/upload/confirm`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({ file_id: fileId }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to confirm upload");
    }
  };

  const uploadSingleFile = async (
    file: File,
    title: string,
    description?: string,
  ): Promise<string> => {
    const uploadState = createUploadState(file);
    setUploads((prev) => [...prev, uploadState]);

    try {
      if (file.size > MEDIA_CONFIG.MAX_FILE_SIZE_BYTES) {
        throw new Error(
          `File size exceeds maximum allowed (${formatFileSize(MEDIA_CONFIG.MAX_FILE_SIZE_BYTES)})`,
        );
      }

      if (!isSupportedType(file.type)) {
        throw new Error(
          `Unsupported file type: ${file.type}. Supported types: ${MEDIA_CONFIG.SUPPORTED_TYPES.join(", ")}`,
        );
      }

      updateUpload(uploadState.id, { status: "uploading" });

      const { file_id, presigned_url } = await getPresignedUrl(
        file.type,
        title,
        description,
      );

      await uploadToS3(presigned_url, file, (progress) => {
        updateUpload(uploadState.id, { progress: Math.round(progress) });
      });

      updateUpload(uploadState.id, { status: "confirming", progress: 100 });

      await confirmUpload(file_id);

      updateUpload(uploadState.id, { status: "completed" });

      return file_id;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      updateUpload(uploadState.id, { status: "error", error: errorMessage });
      throw error;
    }
  };

  const uploadFile = useCallback(
    async (
      file: File,
      title: string,
      description?: string,
    ): Promise<string> => {
      setIsUploading(true);
      try {
        return await uploadSingleFile(file, title, description);
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  const uploadFiles = useCallback(
    async (files: FileList, defaultTitle?: string): Promise<string[]> => {
      setIsUploading(true);
      const results: string[] = [];
      const errors: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const title = defaultTitle || file.name;

        try {
          const fileId = await uploadSingleFile(file, title);
          results.push(fileId);
        } catch (error) {
          errors.push(file.name);
        }
      }

      if (errors.length > 0) {
        toast.error(
          `Failed to upload ${errors.length} file(s): ${errors.join(", ")}`,
        );
      }

      if (results.length > 0) {
        toast.success(`Successfully uploaded ${results.length} file(s)`);
      }

      setIsUploading(false);
      return results;
    },
    [],
  );

  return {
    uploads,
    uploadFile,
    uploadFiles,
    removeUpload,
    clearCompleted,
    isUploading,
  };
}
