import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'https://api.my-love-application.ru';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      const response = await fetch(`${API_URL}/v1/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // API возвращает { user: UserDTO }
        setUser(userData.user);
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
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
    try {
      const refresh = localStorage.getItem('refresh_token');
      const response = await fetch(`${API_URL}/v1/auth/refresh`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${refresh}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      await logout();
    }
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