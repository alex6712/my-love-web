import { apiClient } from '@/shared/api/api-client';

interface LoginData {
  username: string;
  password: string;
}

interface TokensResponse {
  code: string;
  detail: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface UserResponse {
  code: string;
  detail: string;
  user: {
    id: string;
    created_at: string;
    username: string;
    avatar_url: string | null;
    is_active: boolean;
  };
}

interface RegisterData {
  username: string;
  password: string;
}

export const authApi = {
  async login(username: string, password: string): Promise<TokensResponse> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    return apiClient.post<TokensResponse>('/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  async register(username: string, password: string): Promise<any> {
    return apiClient.post('/v1/auth/register', { username, password });
  },

  async getMe(): Promise<UserResponse['user']> {
    const response = await apiClient.get<UserResponse>('/v1/users/me');
    return response.user;
  },

  async refreshToken(refreshToken: string): Promise<TokensResponse> {
    return apiClient.post<TokensResponse>('/v1/auth/refresh', null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  },

  async logout(): Promise<any> {
    return apiClient.post('/v1/auth/logout');
  },
};
