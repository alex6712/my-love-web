import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'https://api.my-love-application.ru';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshPromiseRef = useRef<Promise<void> | null>(null);

  // Проверка токена при загрузке
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Попытка получить информацию о пользователе
      fetchUserInfo();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/v1/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // API возвращает { user: UserDTO }
        setUser(userData.user);
      } else if (response.status === 401) {
        // Попытка обновить токен при 401 ошибке
        try {
          await refreshToken();
          // Повторный запрос после обновления токена
          const newToken = localStorage.getItem('access_token');
          if (newToken) {
            const retryResponse = await fetch(`${API_URL}/v1/users/me`, {
              headers: {
                'Authorization': `Bearer ${newToken}`,
              },
            });
            if (retryResponse.ok) {
              const userData = await retryResponse.json();
              setUser(userData.user);
            } else {
              // Если повторный запрос тоже не удался, очищаем токены
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              setUser(null);
            }
          }
        } catch (refreshError) {
          // Если обновление токена не удалось, очищаем токены
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${API_URL}/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Ошибка входа');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      await fetchUserInfo();
      toast.success('Добро пожаловать! 💖');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка входа');
      throw error;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Ошибка регистрации');
      }

      toast.success('Регистрация успешна! Теперь войдите в систему.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка регистрации');
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`${API_URL}/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      toast.success('До скорой встречи! 👋');
    }
  };

  const refreshToken = async () => {
    // Предотвращаем одновременные попытки обновления токена
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const refreshPromise = (async () => {
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) {
          throw new Error('No refresh token available');
        }

        const response = await fetch(`${API_URL}/v1/auth/refresh`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${refresh}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('access_token', data.access_token);
          // Если API возвращает новый refresh_token, обновляем его тоже
          if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token);
          }
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (error) {
        // Очищаем токены при ошибке обновления
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        throw error;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = refreshPromise;
    return refreshPromise;
  };

  // Обертка для fetch запросов с автоматическим обновлением токена
  const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem('access_token');

    // Добавляем токен в заголовки, если его там нет
    const headers = new Headers(options.headers);
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Если получили 401, пытаемся обновить токен и повторить запрос
    if (response.status === 401) {
      console.log('401 error'); // TODO: remove this

      try {
        await refreshToken();
        const newToken = localStorage.getItem('access_token');

        if (newToken) {
          // Обновляем заголовок с новым токеном
          headers.set('Authorization', `Bearer ${newToken}`);

          // Повторяем запрос с новым токеном
          response = await fetch(url, {
            ...options,
            headers,
          });
        } else {
          // Если токен не был обновлен, выбрасываем ошибку
          throw new Error('Failed to refresh token');
        }
      } catch (error) {
        // Если обновление токена не удалось, возвращаем исходный ответ
        return response;
      }
    }

    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
        authenticatedFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
