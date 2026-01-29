import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Heart } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useAuth } from '@/features/auth';
import { authApi } from '@/features/auth/api/authApi';
import { toast } from 'sonner';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Получаем токены
      const response = await authApi.login(
        formData.username,
        formData.password
      );

      // 2. Сохраняем токены
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);

      // 3. Устанавливаем флаг аутентификации
      setIsAuthenticated(true);

      toast.success('Добро пожаловать!');
      navigate('/');
    } catch (error: any) {
      toast.error('Неверное имя пользователя или пароль');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <Heart className="h-16 w-16 text-romantic-heart mx-auto mb-4 heartbeat" />
        <h1 className="text-3xl font-romantic font-bold text-gray-900 dark:text-white">
          С возвращением!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Войдите в наш личный сад воспоминаний
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Имя пользователя
          </label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Введите ваше имя пользователя"
            required
            leftIcon={<Mail className="h-4 w-4" />}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Пароль
          </label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите ваш пароль"
            required
            leftIcon={<Lock className="h-4 w-4" />}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          fullWidth
          className="mt-8"
        >
          Войти
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Нет аккаунта?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-romantic-pink hover:text-romantic-rose font-medium"
            >
              Зарегистрироваться
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
