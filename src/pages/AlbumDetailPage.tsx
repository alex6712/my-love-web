import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Image as ImageIcon, Calendar, User } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

const MOCK_ALBUM = {
  id: '1',
  title: 'Поездка в Париж',
  description: 'Незабываемые дни в городе любви. Эйфелева башня, прогулки по Сене и уютные кафе.',
  cover_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
  created_at: '2024-02-14T10:30:00Z',
  creator: {
    username: 'alex',
    avatar_url: null,
  },
  items: [
    {
      id: '1',
      title: 'У Эйфелевой башни',
      description: 'Наш первый день в Париже',
      created_at: '2024-02-14T12:00:00Z',
      content_type: 'image/jpeg',
      preview_url: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e',
    },
    {
      id: '2',
      title: 'Завтрак в кафе',
      description: 'Традиционные круассаны и кофе',
      created_at: '2024-02-15T09:00:00Z',
      content_type: 'image/jpeg',
      preview_url: 'https://images.unsplash.com/photo-1493770348161-369560ae357d',
    },
    {
      id: '3',
      title: 'Прогулка по Сене',
      description: 'Вечерняя прогулка вдоль реки',
      created_at: '2024-02-15T20:00:00Z',
      content_type: 'image/jpeg',
      preview_url: 'https://images.unsplash.com/photo-1431274172761-fca41d930114',
    },
  ],
};

const AlbumDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Хлебные крошки и действия */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/albums')}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Назад к альбомам
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" size="sm" leftIcon={<Edit className="h-4 w-4" />}>
            Редактировать
          </Button>
          <Button variant="danger" size="sm" leftIcon={<Trash2 className="h-4 w-4" />}>
            Удалить
          </Button>
        </div>
      </div>

      {/* Заголовок альбома */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="aspect-square rounded-xl overflow-hidden">
              <img
                src={MOCK_ALBUM.cover_url}
                alt={MOCK_ALBUM.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:w-2/3 space-y-4">
            <div>
              <h1 className="text-3xl font-romantic font-bold text-gray-900 dark:text-white">
                {MOCK_ALBUM.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {MOCK_ALBUM.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-romantic-pink/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-romantic-pink" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Создан</p>
                  <p className="font-medium">
                    {new Date(MOCK_ALBUM.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-romantic-rose/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-romantic-rose" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Создатель</p>
                  <p className="font-medium">{MOCK_ALBUM.creator.username}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-romantic-heart/10 flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-romantic-heart" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Фотографий</p>
                  <p className="font-medium">{MOCK_ALBUM.items.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Фотографии альбома */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Фотографии ({MOCK_ALBUM.items.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {MOCK_ALBUM.items.map((item) => (
            <div key={item.id} className="card overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.preview_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">{item.title}</h3>
                <p className="text-gray-500 text-xs truncate">{item.description}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(item.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          ))}

          {/* Кнопка добавления фото */}
          <button className="card border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-romantic-pink hover:bg-romantic-pink/5 transition-colors flex flex-col items-center justify-center p-4 aspect-square">
            <div className="h-12 w-12 rounded-full bg-romantic-pink/10 flex items-center justify-center mb-3">
              <ImageIcon className="h-6 w-6 text-romantic-pink" />
            </div>
            <p className="font-medium text-sm">Добавить фото</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetailPage;