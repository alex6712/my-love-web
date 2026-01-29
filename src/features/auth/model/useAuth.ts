import { useEffect } from 'react';
import { useAuthStore } from './store';
import { authApi } from '../api/authApi';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setIsAuthenticated,
    setIsLoading,
    logout,
  } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Получаем данные пользователя по токену
        const userData = await authApi.getMe();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // Если токен невалидный, очищаем
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [setUser, setIsAuthenticated, setIsLoading]);

  const handleLogout = async () => {
    try {
      // Пытаемся вызвать logout на сервере
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Даже если серверный logout не сработал, очищаем клиентскую сторону
    } finally {
      // Всегда очищаем локальное хранилище
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      logout();
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setIsAuthenticated,
    setIsLoading,
    logout: handleLogout,
  };
};
