export type APICode =
  | 'SUCCESS'
  | 'RESOURCE_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INCORRECT_USERNAME_PASSWORD'
  | 'TOKEN_NOT_PASSED'
  | 'INVALID_TOKEN'
  | 'TOKEN_SIGNATURE_EXPIRED'
  | 'TOKEN_REVOKED'
  | 'INVALID_IDEMPOTENCY_KEY'
  | 'IDEMPOTENCY_CONFLICT'
  | 'UNIQUE_CONFLICT'
  | 'COUPLE_NOT_SELF'
  | 'ALBUM_NOT_FOUND'
  | 'FILE_NOT_FOUND'
  | 'UNSUPPORTED_FILE_TYPE'
  | 'UPLOAD_NOT_COMPLETED'
  | 'RATE_LIMIT_EXCEEDED'

export interface StandardResponse {
  code: APICode
  detail: string
}

export interface UserDTO {
  id: string
  created_at: string
  username: string
  avatar_url: string | null
  is_active: boolean
}

export interface PartnerResponse extends StandardResponse {
  partner: UserDTO | null
}

export interface RegisterRequest {
  username: string
  password: string
}

export interface TokensResponse extends StandardResponse {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
}

export interface CreateCoupleRequest {
  partner_username: string
}

export interface CoupleRequestStatus {
  PENDING: 'PENDING'
  ACCEPTED: 'ACCEPTED'
  DECLINED: 'DECLINED'
  EXPIRED: 'EXPIRED'
}

export interface CoupleRequestDTO {
  id: string
  created_at: string
  initiator: UserDTO
  recipient: UserDTO
  status: CoupleRequestStatus[keyof CoupleRequestStatus]
  accepted_at: string | null
}

export interface PendingRequestsResponse extends StandardResponse {
  requests: CoupleRequestDTO[]
}

export interface FileStatus {
  PENDING: 'PENDING'
  UPLOADED: 'UPLOADED'
  FAILED: 'FAILED'
  DELETED: 'DELETED'
}

export interface FileDTO {
  id: string
  created_at: string
  content_type: string
  title: string
  description: string | null
  object_key: string
  status: FileStatus[keyof FileStatus]
  geo_data: unknown | null
  creator: UserDTO
}

export interface FilesResponse extends StandardResponse {
  files: FileDTO[]
  total?: number
}

export interface UploadFileRequest {
  content_type: string
  filename: string
  title: string
  description?: string
}

export interface UploadFileResponse extends StandardResponse {
  file_id: string
  presigned_url: string
  object_key: string
  method: 'PUT'
  headers: Record<string, string>
}

export interface UploadFileBatchRequest {
  files: UploadFileRequest[]
}

export interface ConfirmUploadRequest {
  file_id: string
}

export interface DownloadFileResponse extends StandardResponse {
  presigned_url: string
  method: 'GET'
  headers: Record<string, string>
}

export interface UpdateFileRequest {
  title: string
  description?: string
}

export interface AlbumDTO {
  id: string
  created_at: string
  title: string
  description: string | null
  cover_url: string | null
  is_private: boolean
  creator: UserDTO
  items?: FileDTO[]
}

export interface AlbumsResponse extends StandardResponse {
  albums: AlbumDTO[]
  total?: number
}

export interface CreateAlbumRequest {
  title?: string
  description?: string
  cover_url?: string
  is_private?: boolean
}

export interface UpdateAlbumRequest extends CreateAlbumRequest {}

export interface SearchAlbumsRequest {
  q: string
  threshold?: number
  limit?: number
}

export interface AttachFilesRequest {
  files_uuids: string[]
}

export interface NoteType {
  WISHLIST: 'WISHLIST'
  GRATITUDE: 'GRATITUDE'
  IDEA: 'IDEA'
  MEMORY: 'MEMORY'
  OTHER: 'OTHER'
}

export interface NoteDTO {
  id: string
  created_at: string
  title: string
  content: string
  type: NoteType[keyof NoteType]
}

export interface NotesResponse extends StandardResponse {
  notes: NoteDTO[]
  total?: number
}

export interface CreateNoteRequest {
  title?: string
  content: string
  type: NoteType[keyof NoteType]
}

export interface UpdateNoteRequest extends CreateNoteRequest {}

export interface MeResponse extends StandardResponse {
  user: UserDTO
}
