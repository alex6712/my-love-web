import { apiClient } from '@/shared/api/api-client';
import {
  FilesResponse,
  PresignedURLResponse,
  PresignedURLsBatchResponse,
  UploadFileRequest,
  UpdateFileRequest,
  StandardResponse,
} from './types';

export const mediaApi = {
  async getFiles(): Promise<FilesResponse> {
    return apiClient.get<FilesResponse>('/v1/media/files');
  },

  async getPresignedUploadUrl(
    data: UploadFileRequest
  ): Promise<PresignedURLResponse> {
    return apiClient.post<PresignedURLResponse>('/v1/media/files/upload', data);
  },

  async uploadBatch(
    files: Array<{
      content_type: string;
      title: string;
      description: string | null;
    }>
  ): Promise<PresignedURLsBatchResponse> {
    return apiClient.post<PresignedURLsBatchResponse>(
      '/v1/media/files/upload/batch',
      {
        files_metadata: files,
      }
    );
  },

  async confirmUpload(file_id: string): Promise<StandardResponse> {
    return apiClient.post<StandardResponse>('/v1/media/files/upload/confirm', {
      file_id,
    });
  },

  async downloadFile(file_id: string): Promise<Blob> {
    const response = await apiClient.get<Blob>(
      `/v1/media/files/${file_id}/download`
    );
    return response;
  },

  async updateFile(
    file_id: string,
    data: UpdateFileRequest
  ): Promise<StandardResponse> {
    return apiClient.put<StandardResponse>(`/v1/media/files/${file_id}`, data);
  },

  async deleteFile(file_id: string): Promise<StandardResponse> {
    return apiClient.delete<StandardResponse>(`/v1/media/files/${file_id}`);
  },
};
