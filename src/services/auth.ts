import { apiClient } from '@/shared/api/api-client';
import { RegisterRequest, TokensResponse, UserDTO } from './types';

export const authApi = {
  async login(username: string, password: string): Promise<TokensResponse> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return apiClient.post<TokensResponse>('/v1/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },

  async register(
    data: RegisterRequest
  ): Promise<{ code: string; detail: string }> {
    return apiClient.post('/v1/auth/register', data);
  },

  async getMe(): Promise<UserDTO> {
    const response = await apiClient.get<{ user: UserDTO }>('/v1/users/me');
    return response.user;
  },

  async refreshToken(refreshToken: string): Promise<TokensResponse> {
    return apiClient.post<TokensResponse>('/v1/auth/refresh', null, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
  },

  async logout(): Promise<void> {
    await apiClient.post('/v1/auth/logout');
  },
};
