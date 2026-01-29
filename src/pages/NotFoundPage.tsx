import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-romantic-pink/10 via-white to-romantic-rose/10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="text-center p-8">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-romantic-pink to-romantic-rose rounded-full blur-3xl opacity-30" />
          <Heart className="relative h-32 w-32 text-romantic-heart mx-auto heartbeat" />
        </div>

        <h1 className="text-6xl font-romantic font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Страница не найдена
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
          Похоже, вы заблудились в нашем саду воспоминаний. Эта страница не существует или была перемещена.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate(-1)}
          >
            Вернуться назад
          </Button>
          <Button
            variant="secondary"
            leftIcon={<Home className="h-4 w-4" />}
            onClick={() => navigate('/')}
          >
            На главную
          </Button>
        </div>

        <div className="mt-12">
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p>Возможно, вы искали:</p>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              <button
                onClick={() => navigate('/albums')}
                className="text-romantic-pink hover:text-romantic-rose transition-colors"
              >
                Альбомы
              </button>
              <button
                onClick={() => navigate('/notes')}
                className="text-romantic-pink hover:text-romantic-rose transition-colors"
              >
                Заметки
              </button>
              <button
                onClick={() => navigate('/gallery')}
                className="text-romantic-pink hover:text-romantic-rose transition-colors"
              >
                Галерея
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="text-romantic-pink hover:text-romantic-rose transition-colors"
              >
                Профиль
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;