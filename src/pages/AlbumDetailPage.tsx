import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Image as ImageIcon,
  Calendar,
  User,
  Loader2,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useMediaStore } from '@/features/media/model/store';
import { toast } from 'sonner';

const AlbumDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentAlbum, isLoading, fetchAlbum, deleteAlbum } = useMediaStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', description: '' });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const albumItems = (currentAlbum as any)?.items || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemsCount =
    (currentAlbum as any)?.items?.length || currentAlbum?.items_count || 0;

  useEffect(() => {
    if (id) {
      fetchAlbum(id);
    }
  }, [id, fetchAlbum]);

  useEffect(() => {
    if (currentAlbum) {
      setEditData({
        title: currentAlbum.title,
        description: currentAlbum.description || '',
      });
    }
  }, [currentAlbum]);

  const handleDelete = async () => {
    if (!currentAlbum || !id) return;
    if (!confirm('Вы уверены, что хотите удалить этот альбом?')) return;

    try {
      await deleteAlbum(id);
      toast.success('Альбом удалён');
      navigate('/albums');
    } catch {
      toast.error('Не удалось удалить альбом');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading && !currentAlbum) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-romantic-pink" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          Загрузка альбома...
        </span>
      </div>
    );
  }

  if (!currentAlbum) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Альбом не найден</h2>
        <Button variant="secondary" onClick={() => navigate('/albums')}>
          Вернуться к альбомам
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={() => setIsEditing(!isEditing)}
          >
            Редактировать
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={handleDelete}
          >
            Удалить
          </Button>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
              {currentAlbum.cover_url ? (
                <img
                  src={currentAlbum.cover_url}
                  alt={currentAlbum.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl">📁</span>
                </div>
              )}
            </div>
          </div>
          <div className="md:w-2/3 space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Название
                  </label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Описание
                  </label>
                  <textarea
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      // TODO: Implement update
                      setIsEditing(false);
                    }}
                  >
                    Сохранить
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditData({
                        title: currentAlbum.title,
                        description: currentAlbum.description || '',
                      });
                      setIsEditing(false);
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h1 className="text-3xl font-romantic font-bold text-gray-900 dark:text-white">
                    {currentAlbum.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {currentAlbum.description || 'Нет описания'}
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
                        {formatDate(currentAlbum.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-romantic-rose/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-romantic-rose" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Создатель</p>
                      <p className="font-medium">
                        @{currentAlbum.creator.username}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-romantic-heart/10 flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-romantic-heart" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Фотографий</p>
                      <p className="font-medium">{itemsCount}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Фотографии ({itemsCount})
        </h2>
        {albumItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {albumItems.map((item: { id: string; added_at: string }) => (
              <div
                key={item.id}
                className="card overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl">📷</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate">Фото</h3>
                  <p className="text-gray-400 text-xs mt-2">
                    {formatDate(item.added_at)}
                  </p>
                </div>
              </div>
            ))}

            <button className="card border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-romantic-pink hover:bg-romantic-pink/5 transition-colors flex flex-col items-center justify-center p-4 aspect-square">
              <div className="h-12 w-12 rounded-full bg-romantic-pink/10 flex items-center justify-center mb-3">
                <ImageIcon className="h-6 w-6 text-romantic-pink" />
              </div>
              <p className="font-medium text-sm">Добавить фото</p>
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              В альбоме нет фотографий
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Добавьте фотографии в этот альбом
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetailPage;
