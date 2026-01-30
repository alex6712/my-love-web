import apiClient from '../client'
import type {
  FilesResponse,
  UploadFileRequest,
  UploadFileResponse,
  StandardResponse,
  DownloadFileResponse,
  UpdateFileRequest,
  UploadFileBatchRequest,
} from '../types/types'

export const filesApi = {
  getFiles: (params: { offset?: number; limit?: number }) =>
    apiClient.get<FilesResponse>('/media/files', { params }),
  getPresignedUrl: (data: UploadFileRequest, idempotencyKey: string) =>
    apiClient.post<UploadFileResponse>('/media/files/upload', data, {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    }),
  getBatchPresignedUrls: (data: UploadFileBatchRequest, idempotencyKey: string) =>
    apiClient.post('/media/files/upload/batch', data, {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    }),
  confirmUpload: (data: { file_id: string }) =>
    apiClient.post<StandardResponse>('/media/files/upload/confirm', data),
  getDownloadUrl: (fileId: string) =>
    apiClient.get<DownloadFileResponse>(`/media/files/${fileId}/download`),
  updateFile: (fileId: string, data: UpdateFileRequest) =>
    apiClient.put<StandardResponse>(`/media/files/${fileId}`, data),
  deleteFile: (fileId: string) =>
    apiClient.delete<StandardResponse>(`/media/files/${fileId}`),
}