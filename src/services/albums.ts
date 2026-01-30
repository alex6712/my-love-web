import { apiClient } from '@/shared/api/api-client';
import {
  AlbumsResponse,
  AlbumResponse,
  CreateAlbumRequest,
  UpdateAlbumRequest,
  AttachFilesRequest,
  StandardResponse,
} from './types';

export const albumsApi = {
  async getAlbums(): Promise<AlbumsResponse> {
    return apiClient.get<AlbumsResponse>('/v1/media/albums');
  },

  async searchAlbums(query: string): Promise<AlbumsResponse> {
    return apiClient.get<AlbumsResponse>('/v1/media/albums/search', {
      params: { q: query },
    });
  },

  async getAlbum(album_id: string): Promise<AlbumResponse> {
    return apiClient.get<AlbumResponse>(`/v1/media/albums/${album_id}`);
  },

  async createAlbum(data: CreateAlbumRequest): Promise<AlbumResponse> {
    return apiClient.post<AlbumResponse>('/v1/media/albums', data);
  },

  async updateAlbum(
    album_id: string,
    data: UpdateAlbumRequest
  ): Promise<StandardResponse> {
    return apiClient.put<StandardResponse>(
      `/v1/media/albums/${album_id}`,
      data
    );
  },

  async deleteAlbum(album_id: string): Promise<StandardResponse> {
    return apiClient.delete<StandardResponse>(`/v1/media/albums/${album_id}`);
  },

  async attachFiles(
    album_id: string,
    files_uuids: string[]
  ): Promise<StandardResponse> {
    return apiClient.patch<StandardResponse>(
      `/v1/media/albums/${album_id}/attach`,
      {
        files_uuids,
      } as AttachFilesRequest
    );
  },

  async detachFiles(
    album_id: string,
    files_uuids: string[]
  ): Promise<StandardResponse> {
    return apiClient.patch<StandardResponse>(
      `/v1/media/albums/${album_id}/detach`,
      {
        files_uuids,
      } as AttachFilesRequest
    );
  },
};
