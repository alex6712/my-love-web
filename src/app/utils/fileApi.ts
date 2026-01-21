import { API_URL } from '../constants/api';

export async function getDownloadPresignedUrl(fileId: string): Promise<string> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_URL}/v1/media/files/${fileId}/download/direct`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get download URL');
  }

  const data = await response.json();
  return data.presigned_url;
}
