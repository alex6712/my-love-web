import { API_URL } from '../constants/api';

export type AuthenticatedFetch = (input: string, init?: RequestInit) => Promise<Response>;

export interface AlbumDTO {
  id: string;
  created_at: string;
  title: string;
  description?: string | null;
  cover_url?: string | null;
  is_private: boolean;
  creator: {
    id: string;
    username: string;
    avatar_url?: string | null;
    is_active: boolean;
    created_at: string;
  };
}

export interface AlbumsResponse {
  code: string;
  detail: string;
  albums: AlbumDTO[];
}

export interface AlbumsWithTotal {
  albums: AlbumDTO[];
  total: number;
}

export async function getAlbums(
  offset: number = 0,
  limit: number = 12,
  authenticatedFetch: AuthenticatedFetch = fetch,
): Promise<AlbumsWithTotal> {
  const response = await authenticatedFetch(
    `${API_URL}/v1/media/albums?offset=${offset}&limit=${limit}`,
    {
      method: 'GET',
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get albums');
  }

  const data: AlbumsResponse = await response.json();
  return { albums: data.albums, total: data.albums.length };
}

export async function searchAlbums(
  query: string,
  threshold: number = 0.15,
  limit: number = 10,
  authenticatedFetch: AuthenticatedFetch = fetch,
): Promise<AlbumDTO[]> {
  const response = await authenticatedFetch(
    `${API_URL}/v1/media/albums/search?q=${encodeURIComponent(query)}&threshold=${threshold}&limit=${limit}`,
    {
      method: 'GET',
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to search albums');
  }

  const data: AlbumsResponse = await response.json();
  return data.albums;
}

export async function detachFilesFromAlbum(
  albumId: string,
  fileUuids: string[],
  authenticatedFetch: AuthenticatedFetch = fetch,
): Promise<void> {
  const response = await authenticatedFetch(`${API_URL}/v1/media/albums/${albumId}/detach`, {
    method: 'PATCH',
    body: JSON.stringify({ files_uuids: fileUuids }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to detach files');
  }
}

export async function attachFilesToAlbum(
  albumId: string,
  fileUuids: string[],
  authenticatedFetch: AuthenticatedFetch = fetch,
): Promise<void> {
  const response = await authenticatedFetch(`${API_URL}/v1/media/albums/${albumId}/attach`, {
    method: 'PATCH',
    body: JSON.stringify({ files_uuids: fileUuids }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to attach files');
  }
}

export async function updateAlbum(
  albumId: string,
  data: { title?: string; description?: string | null; is_private?: boolean },
  authenticatedFetch: AuthenticatedFetch = fetch,
): Promise<AlbumDTO> {
  const response = await authenticatedFetch(`${API_URL}/v1/media/albums/${albumId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update album');
  }

  return response.json();
}
