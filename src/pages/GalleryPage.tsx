import React, { useState } from 'react';
import { Search, Filter, Grid, Calendar, Heart } from 'lucide-react';
import { Input } from '@/shared/ui/Input';

const MOCK_PHOTOS = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e',
    title: 'Эйфелева башня',
    description: 'Наш первый день в Париже',
    date: '2024-02-14',
    likes: 24,
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1493770348161-369560ae357d',
    title: 'Завтрак в Париже',
    description: 'Утро начинается с кофе и круассанов',
    date: '2024-02-15',
    likes: 18,
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1431274172761-fca41d930114',
    title: 'Прогулка по Сене',
    description: 'Вечерняя прогулка вдоль реки',
    date: '2024-02-15',
    likes: 32,
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    title: 'Горные вершины',
    description: 'Наши первые горы вместе',
    date: '2024-01-20',
    likes: 28,
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1518834103325-6725c4b54c14',
    title: 'Море и солнце',
    description: 'Отдых на побережье',
    date: '2023-12-05',
    likes: 42,
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5',
    title: 'Новогодняя ёлка',
    description: 'Встречаем Новый год вместе',
    date: '2023-12-31',
    likes: 36,
  },
];

const GalleryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const filteredPhotos = MOCK_PHOTOS.filter((photo) => {
    const matchesSearch =
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || photo.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  // Получаем уникальные даты для фильтра
  const dates = Array.from(new Set(MOCK_PHOTOS.map((photo) => photo.date)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-romantic font-bold text-gray-900 dark:text-white">
          Галерея
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Все ваши фотографии в одном месте
        </p>
      </div>

      {/* Панель фильтров */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Поиск фотографий..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                leftIcon={<Calendar className="h-4 w-4" />}
                className="pr-10"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Галерея */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Фотографии не найдены
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="card overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Информация о фото (появляется при наведении) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-bold text-white text-sm truncate">
                    {photo.title}
                  </h3>
                  <p className="text-white/80 text-xs truncate">
                    {photo.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white/70 text-xs">
                      {new Date(photo.date).toLocaleDateString('ru-RU')}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 text-white" />
                      <span className="text-white text-xs">{photo.likes}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Информация о фото (постоянная для мобильных) */}
              <div className="p-3 md:hidden">
                <h3 className="font-medium text-sm truncate">{photo.title}</h3>
                <p className="text-gray-500 text-xs truncate">
                  {photo.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-400 text-xs">
                    {new Date(photo.date).toLocaleDateString('ru-RU')}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-400 text-xs">{photo.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-romantic-pink">
            {MOCK_PHOTOS.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Всего фото
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-romantic-pink">
            {dates.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Дней с фото
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-romantic-pink">
            {Math.round(
              MOCK_PHOTOS.reduce((acc, photo) => acc + photo.likes, 0) /
                MOCK_PHOTOS.length
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Среднее кол-во лайков
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-romantic-pink">2024</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Год самого старого фото
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
