import { API_URL } from "../constants/api";

interface BatchDownloadFailedItem {
  code: string;
  message: string;
  file_id: string;
}

interface BatchDownloadResult {
  successful: Record<string, string>;
  failed: BatchDownloadFailedItem[];
}

export async function getDownloadPresignedUrl(
  fileId: string,
  authenticatedFetch?: (url: string, options?: RequestInit) => Promise<Response>,
): Promise<string> {
  const fetchWithAuth = authenticatedFetch || fetch.bind(undefined);

  const response = await fetchWithAuth(`${API_URL}/v1/media/files/${fileId}/download`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to get download URL");
  }

  const data = await response.json();
  return data.url.presigned_url;
}

export async function getDownloadPresignedUrls(
  fileIds: string[],
  authenticatedFetch?: (url: string, options?: RequestInit) => Promise<Response>,
): Promise<BatchDownloadResult> {
  const fetchWithAuth = authenticatedFetch || fetch.bind(undefined);

  const response = await fetchWithAuth(`${API_URL}/v1/media/files/download/batch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ files_uuids: fileIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to get download URLs");
  }

  const data = await response.json();

  const successful = (data.successful || []).reduce(
    (acc: Record<string, string>, item: { file_id: string; presigned_url: string }) => {
      acc[item.file_id] = item.presigned_url;
      return acc;
    },
    {},
  );

  return {
    successful,
    failed: data.failed || [],
  };
}
