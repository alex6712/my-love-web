import { UserDTO, FileStatus } from './common';

export interface CreatorDTO extends UserDTO {}

export interface GeoData {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface FileDTO {
  id: string;
  created_at: string;
  content_type: string;
  title: string;
  description: string | null;
  object_key: string;
  status: FileStatus;
  geo_data: GeoData | null;
  creator: CreatorDTO;
}

export interface FilesResponse {
  files: FileDTO[];
}

export interface UploadFileRequest {
  content_type: string;
  title: string;
  description: string | null;
}

export interface UploadFilesBatchRequest {
  files_metadata: UploadFileRequest[];
}

export interface UpdateFileRequest {
  content_type: string;
  title: string;
  description: string | null;
}

export interface ConfirmUploadRequest {
  file_id: string;
}

export interface AttachFilesRequest {
  files_uuids: string[];
}

export interface PresignedURLDTO {
  file_id: string;
  presigned_url: string;
}

export interface PresignedURLResponse {
  url: PresignedURLDTO;
}

export interface PresignedURLsBatchResponse {
  urls: PresignedURLDTO[];
}
