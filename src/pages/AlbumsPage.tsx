import React, { useState, useEffect } from 'react';
import { Plus, Search, Grid, List, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useMediaStore } from '@/features/media/model/store';
import { toast } from 'sonner';

const AlbumsPage: React.FC = () => {
  const navigate = useNavigate();
  const { albums, isLoading, error, fetchAlbums, createAlbum } =
    useMediaStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ title: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const filteredAlbums = albums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (album.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false)
  );

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbum.title.trim()) return;

    setIsCreating(true);
    try {
      await createAlbum({
        title: newAlbum.title.trim(),
        description: newAlbum.description.trim() || null,
        cover_url: null,
        is_private: false,
      });
      toast.success('Альбом создан');
      setShowCreateForm(false);
      setNewAlbum({ title: '', description: '' });
    } catch {
      toast.error(error || 'Не удалось создать альбом');
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading && albums.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-romantic-pink" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          Загрузка альбомов...
        </span>
      </div>
    );
  }

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
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowCreateForm(true)}
        >
          Новый альбом
        </Button>
      </div>

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

      {filteredAlbums.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Альбомы не найдены
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery
              ? 'Попробуйте изменить параметры поиска'
              : 'Создайте свой первый альбом'}
          </p>
          {!searchQuery && (
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setShowCreateForm(true)}
            >
              Создать альбом
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              className="card group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/albums/${album.id}`)}
            >
              <div className="aspect-square overflow-hidden bg-gray-200 dark:bg-gray-700">
                {album.cover_url ? (
                  <img
                    src={album.cover_url}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">📁</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg truncate">{album.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 truncate">
                  {album.description || 'Нет описания'}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-500">
                    {album.items_count || 0} фото
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(album.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowCreateForm(true)}
            className="card border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-romantic-pink hover:bg-romantic-pink/5 transition-colors flex flex-col items-center justify-center p-8"
          >
            <div className="h-12 w-12 rounded-full bg-romantic-pink/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-romantic-pink" />
            </div>
            <p className="font-medium">Создать альбом</p>
            <p className="text-sm text-gray-500 mt-1">Добавить новый альбом</p>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/albums/${album.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                  {album.cover_url ? (
                    <img
                      src={album.cover_url}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xl">📁</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{album.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                    {album.description || 'Нет описания'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {album.items_count || 0} фото
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(album.created_at)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md card p-6">
            <h2 className="text-xl font-bold mb-4">Создать альбом</h2>
            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Название
                </label>
                <Input
                  placeholder="Название альбома"
                  value={newAlbum.title}
                  onChange={(e) =>
                    setNewAlbum({ ...newAlbum, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Описание
                </label>
                <textarea
                  placeholder="Описание альбома (необязательно)"
                  value={newAlbum.description}
                  onChange={(e) =>
                    setNewAlbum({ ...newAlbum, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isCreating}
                  className="flex-1"
                >
                  Создать
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumsPage;
