import React, { useState } from 'react';
import { Plus, Search, Grid, List } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

const MOCK_ALBUMS = [
  {
    id: '1',
    title: 'Поездка в Париж',
    description: 'Незабываемые дни в городе любви',
    cover_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    items_count: 24,
    created_at: '2024-02-14',
  },
  {
    id: '2',
    title: 'Домашние вечера',
    description: 'Уютные моменты вдвоём',
    cover_url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37',
    items_count: 18,
    created_at: '2024-01-20',
  },
  {
    id: '3',
    title: 'Отпуск на море',
    description: 'Солнце, песок и море счастья',
    cover_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    items_count: 42,
    created_at: '2023-12-05',
  },
  {
    id: '4',
    title: 'Праздничные дни',
    description: 'Новый год и Рождество вместе',
    cover_url: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5',
    items_count: 31,
    created_at: '2023-12-31',
  },
];

const AlbumsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-romantic font-bold text-gray-900 dark:text-white">
            Альбомы
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Все ваши воспоминания, организованные в альбомы
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
          Новый альбом
        </Button>
      </div>

      {/* Панель поиска и фильтров */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Поиск альбомов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Список альбомов */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_ALBUMS.map((album) => (
            <div key={album.id} className="card group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img
                  src={album.cover_url}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg truncate">{album.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 truncate">
                  {album.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-500">
                    {album.items_count} фото
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(album.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Кнопка добавления нового альбома */}
          <button className="card border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-romantic-pink hover:bg-romantic-pink/5 transition-colors flex flex-col items-center justify-center p-8">
            <div className="h-12 w-12 rounded-full bg-romantic-pink/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-romantic-pink" />
            </div>
            <p className="font-medium">Создать альбом</p>
            <p className="text-sm text-gray-500 mt-1">Добавить новый альбом</p>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {MOCK_ALBUMS.map((album) => (
            <div key={album.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={album.cover_url}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{album.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                    {album.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">{album.items_count} фото</div>
                  <div className="text-sm text-gray-500">
                    {new Date(album.created_at).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumsPage;