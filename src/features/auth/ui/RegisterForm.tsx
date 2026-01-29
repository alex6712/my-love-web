import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Heart } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { authApi } from '@/features/auth/api/authApi';
import { toast } from 'sonner';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.username.length < 3 || formData.username.length > 32) {
      newErrors.username = 'Имя пользователя должно быть от 3 до 32 символов';
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Можно использовать только буквы, цифры, _ и -';
    }

    if (formData.password.length < 12) {
      newErrors.password = 'Пароль должен быть не менее 12 символов';
    }

    if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать строчные буквы';
    }

    if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать заглавные буквы';
    }

    if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать цифры';
    }

    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать специальные символы';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await authApi.register(formData.username, formData.password);
      toast.success('Регистрация успешна! Теперь войдите в систему');
      navigate('/login');
    } catch (error: any) {
      if (error.response?.status === 422) {
        toast.error('Пользователь с таким именем уже существует');
      } else {
        toast.error('Ошибка регистрации');
      }
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Очищаем ошибку при изменении поля
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <Heart className="h-16 w-16 text-romantic-heart mx-auto mb-4 heartbeat" />
        <h1 className="text-3xl font-romantic font-bold text-gray-900 dark:text-white">
          Начнём нашу историю
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Создайте аккаунт для нашего личного сада
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
            placeholder="Придумайте имя пользователя"
            required
            leftIcon={<User className="h-4 w-4" />}
            error={errors.username}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            3-32 символа, можно использовать буквы, цифры, _ и -
          </p>
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
            placeholder="Придумайте безопасный пароль"
            required
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Минимум 12 символов, должны быть заглавные и строчные буквы, цифры и специальные символы
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Подтверждение пароля
          </label>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Повторите пароль"
            required
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.confirmPassword}
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
          Зарегистрироваться
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Уже есть аккаунт?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-romantic-pink hover:text-romantic-rose font-medium"
            >
              Войти
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
