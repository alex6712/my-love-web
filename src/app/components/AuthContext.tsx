import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { API_URL } from '../constants/api';

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
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [, setAccessToken] = useState<string | null>(() => localStorage.getItem('ml_at'));
  const [isLoading, setIsLoading] = useState(true);
  const unauthorizedHandledRef = useRef(false);
  const isRefreshing = useRef(false);
  const failedQueue = useRef<
    Array<{
      resolve: (token: string) => void;
      reject: (error: unknown) => void;
    }>
  >([]);

  const saveToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem('ml_at', token);
    } else {
      localStorage.removeItem('ml_at');
    }
    setAccessToken(token);
  }, []);

  const processQueue = useCallback((error: unknown, token: string | null = null) => {
    failedQueue.current.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else if (token) {
        resolve(token);
      }
    });
    failedQueue.current = [];
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    if (isRefreshing.current) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.current.push({ resolve, reject });
      });
    }

    isRefreshing.current = true;

    try {
      const response = await fetch(`${API_URL}/v1/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        saveToken(data.access_token);
        processQueue(null, data.access_token);
        return data.access_token;
      } else {
        saveToken(null);
        processQueue(new Error('Refresh failed'));
        return null;
      }
    } catch (error) {
      saveToken(null);
      processQueue(error);
      return null;
    } finally {
      isRefreshing.current = false;
    }
  }, [saveToken, processQueue]);

  const handleUnauthorized = useCallback(() => {
    if (unauthorizedHandledRef.current) {
      return;
    }
    unauthorizedHandledRef.current = true;
    saveToken(null);
    setUser(null);
    toast.error('Сессия истекла, войдите снова');
    navigate('/login', { replace: true });
  }, [navigate, saveToken]);

  useEffect(() => {
    const initSession = async () => {
      let token = localStorage.getItem('ml_at');

      if (!token) {
        token = await refreshAccessToken();
        if (!token) {
          setIsLoading(false);
          return;
        }
      }

      try {
        const response = await fetch(`${API_URL}/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          unauthorizedHandledRef.current = false;
        } else if (response.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            const retryResponse = await fetch(`${API_URL}/v1/users/me`, {
              headers: { Authorization: `Bearer ${newToken}` },
              credentials: 'include',
            });
            if (retryResponse.ok) {
              const data = await retryResponse.json();
              setUser(data.user);
              unauthorizedHandledRef.current = false;
            }
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, [refreshAccessToken]);

  const login = async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Ошибка входа');
    }

    const data = await response.json();
    const token = data.access_token;
    saveToken(token);

    const userResponse = await fetch(`${API_URL}/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      setUser(userData.user);
    } else {
      saveToken(null);
      throw new Error('Не удалось получить данные пользователя');
    }

    unauthorizedHandledRef.current = false;
    toast.success('Добро пожаловать! 💖');
  };

  const register = async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Ошибка регистрации');
    }

    toast.success('Регистрация успешна! Теперь войдите в систему.');
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('ml_at');
      await fetch(`${API_URL}/v1/auth/logout`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      saveToken(null);
      setUser(null);
      unauthorizedHandledRef.current = false;
      toast.success('До скорой встречи! 👋');
    }
  };

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const headers = new Headers(options.headers);
      const token = localStorage.getItem('ml_at');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      if (options.body && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }

      let response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          headers.set('Authorization', `Bearer ${newToken}`);
          response = await fetch(url, {
            ...options,
            headers,
            credentials: 'include',
          });
        } else {
          handleUnauthorized();
        }
      }

      return response;
    },
    [refreshAccessToken, handleUnauthorized],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        authenticatedFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
