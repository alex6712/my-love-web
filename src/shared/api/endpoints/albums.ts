import apiClient from '../client'
import type {
  AlbumsResponse,
  CreateAlbumRequest,
  StandardResponse,
  SearchAlbumsRequest,
  AlbumDTO,
  UpdateAlbumRequest,
  AttachFilesRequest,
} from '../types/types'

export const albumsApi = {
  getAlbums: (params: { offset?: number; limit?: number }) =>
    apiClient.get<AlbumsResponse>('/media/albums', { params }),
  createAlbum: (data: CreateAlbumRequest) =>
    apiClient.post<StandardResponse>('/media/albums', data),
  searchAlbums: (params: SearchAlbumsRequest) =>
    apiClient.get<AlbumsResponse>('/media/albums/search', { params }),
  getAlbum: (albumId: string) =>
    apiClient.get<{ album: AlbumDTO; detail: string; code: string }>(`/media/albums/${albumId}`),
  updateAlbum: (albumId: string, data: UpdateAlbumRequest) =>
    apiClient.put<StandardResponse>(`/media/albums/${albumId}`, data),
  deleteAlbum: (albumId: string) =>
    apiClient.delete<StandardResponse>(`/media/albums/${albumId}`),
  attachFiles: (albumId: string, data: AttachFilesRequest) =>
    apiClient.patch<StandardResponse>(`/media/albums/${albumId}/attach`, data),
  detachFiles: (albumId: string, data: AttachFilesRequest) =>
    apiClient.patch<StandardResponse>(`/media/albums/${albumId}/detach`, data),
}