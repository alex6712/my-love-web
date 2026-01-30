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
  | 'RATE_LIMIT_EXCEEDED';

export interface StandardResponse {
  code: APICode;
  detail: string;
}

export interface ValidationErrorResponse {
  code: APICode;
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

export interface UserDTO {
  id: string;
  created_at: string;
  username: string;
  avatar_url: string | null;
  is_active: boolean;
}

export interface UserResponse {
  user: UserDTO | null;
}

export interface CreatorDTO extends UserDTO {}

export type FileStatus = 'PENDING' | 'UPLOADED' | 'FAILED' | 'DELETED';
