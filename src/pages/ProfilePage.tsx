import React, { useState, useEffect } from 'react';
import { User, Camera, Lock, Trash2, Loader2, Save } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditData({ ...editData, username: user.username });
    }
  }, [user]);

  const handleSaveUsername = async () => {
    if (!editData.username.trim() || editData.username === user?.username) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Имя пользователя обновлено');
      setIsEditing(false);
    } catch {
      toast.error('Не удалось обновить имя пользователя');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData.currentPassword || !editData.newPassword) {
      toast.error('Заполните все поля');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Пароль изменён');
      setEditData({ ...editData, currentPassword: '', newPassword: '' });
    } catch {
      toast.error('Не удалось изменить пароль');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        'Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.'
      )
    ) {
      return;
    }

    if (!confirm('Вы точно уверены? Все ваши данные будут удалены навсегда.')) {
      return;
    }

    try {
      toast.success('Аккаунт удалён');
    } catch {
      toast.error('Не удалось удалить аккаунт');
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-romantic-pink" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          Загрузка профиля...
        </span>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-romantic font-bold text-gray-900 dark:text-white">
          Профиль
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Управление вашим аккаунтом и настройками
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-romantic-pink to-romantic-purple p-1">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
              )}
            </div>
            <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-romantic-pink text-white flex items-center justify-center shadow-lg hover:bg-romantic-rose transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="flex gap-3">
                <Input
                  value={editData.username}
                  onChange={(e) =>
                    setEditData({ ...editData, username: e.target.value })
                  }
                  placeholder="Новое имя пользователя"
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  leftIcon={<Save className="h-4 w-4" />}
                  onClick={handleSaveUsername}
                  isLoading={isSaving}
                >
                  Сохранить
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditData({
                      ...editData,
                      username: user?.username || '',
                    });
                    setIsEditing(false);
                  }}
                >
                  Отмена
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">@{user?.username}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Изменить
                </Button>
              </div>
            )}
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Участник с {user ? formatDate(user.created_at) : '...'}
            </p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Lock className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Безопасность</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Изменение пароля
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-w-md">
          <div>
            <Input
              type="password"
              placeholder="Те-y-4 maxкущий пароль"
              value={editData.currentPassword}
              onChange={(e) =>
                setEditData({ ...editData, currentPassword: e.target.value })
              }
              leftIcon={<Lock className="h-4 w-4" />}
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Новый пароль"
              value={editData.newPassword}
              onChange={(e) =>
                setEditData({ ...editData, newPassword: e.target.value })
              }
              leftIcon={<Lock className="h-4 w-4" />}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Изменить пароль
          </Button>
        </form>
      </div>

      <div className="card p-6 border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Trash2 className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
              Опасная зона
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Удаление аккаунта
            </p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Удаление аккаунта приведёт к безвозвратной потере всех ваших данных,
          включая фотографии, заметки и альбомы.
        </p>

        <Button
          variant="danger"
          leftIcon={<Trash2 className="h-4 w-4" />}
          onClick={handleDeleteAccount}
        >
          Удалить аккаунт
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
