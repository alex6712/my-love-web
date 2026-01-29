import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Типы ответов от API
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

interface ErrorResponse {
  code: string;
  detail: string;
}

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor для добавления токена
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor для обработки ошибок
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ErrorResponse>) => {
        const originalRequest = error.config;

        // Если ошибка 401 и не запрос на обновление токена
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest.url?.includes('/auth/refresh')
        ) {
          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Если refresh токен невалидный, разлогиниваем
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Обработка других ошибок
        if (error.response) {
          const { data } = error.response;
          if (data?.detail) {
            toast.error(data.detail);
          } else if (error.response.status === 429) {
            toast.error('Слишком много запросов. Пожалуйста, подождите.');
          } else {
            toast.error('Произошла ошибка при выполнении запроса');
          }
        } else if (error.request) {
          toast.error('Нет ответа от сервера. Проверьте подключение.');
        } else {
          toast.error('Ошибка при настройке запроса');
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return null;
    }

    this.refreshPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post<TokensResponse>(
          `${API_URL}/v1/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        resolve(access_token);
      } catch (error) {
        reject(error);
      } finally {
        this.refreshPromise = null;
      }
    });

    return this.refreshPromise;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
