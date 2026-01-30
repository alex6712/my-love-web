import apiClient from '../client'
import type { APICode, StandardResponse, UserDTO } from '@/shared/api/types'

export const authApi = {
  register: (data: { username: string; password: string }) =>
    apiClient.post<StandardResponse>('/auth/register', data),
  login: (username: string, password: string) =>
    apiClient.post<{ access_token: string; refresh_token: string; token_type: string }>(
      '/auth/login',
      `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&grant_type=password`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    ),
  refresh: () => apiClient.post<{ access_token: string; refresh_token: string; token_type: string }>('/auth/refresh'),
  logout: () => apiClient.post<StandardResponse>('/auth/logout'),
  me: () => apiClient.get<{ code: APICode; detail: string; user: UserDTO }>('/users/me'),
}
