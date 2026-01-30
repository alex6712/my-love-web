export interface RegisterRequest {
  username: string;
  password: string;
}

export interface TokensResponse {
  code: string;
  detail: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginData {
  username: string;
  password: string;
}
