import React from 'react';
import { User, Heart, Calendar, Mail } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { Button } from '@/shared/ui/Button';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-romantic font-bold text-gray-900 dark:text-white">
          Мой профиль
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Основная информация */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-romantic-pink to-romantic-rose flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.is_active ? 'Активный пользователь' : 'Не активен'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">Дата регистрации</span>
                </div>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Heart className="h-4 w-4 mr-2" />
                  <span className="text-sm">ID пользователя</span>
                </div>
                <p className="font-medium font-mono text-sm">{user.id}</p>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-romantic-pink">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Альбомов</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-romantic-pink">156</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Фотографий</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-romantic-pink">24</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Заметок</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-romantic-pink">365</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Дней вместе</div>
            </div>
          </div>
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Быстрые действия</h3>
            <div className="space-y-3">
              <Button variant="secondary" fullWidth>
                Изменить профиль
              </Button>
              <Button variant="secondary" fullWidth>
                Настройки приватности
              </Button>
              <Button variant="secondary" fullWidth>
                Экспорт данных
              </Button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Наша пара</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-romantic-pink to-romantic-rose flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">Света & Лёша</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Вместе с 14.02.2024
                  </p>
                </div>
              </div>
              <Button variant="primary" fullWidth>
                Пригласить партнёра
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
