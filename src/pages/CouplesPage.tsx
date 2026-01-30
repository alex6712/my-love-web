import React, { useState, useEffect } from 'react';
import {
  Heart,
  Users,
  Calendar,
  Camera,
  MessageCircle,
  Loader2,
  Send,
  Check,
  X,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useCouplesStore } from '@/features/couples/model/store';
import { useMediaStore } from '@/features/media/model/store';
import { useNotesStore } from '@/features/notes/model/store';
import { toast } from 'sonner';

const CouplesPage: React.FC = () => {
  const {
    partner,
    pendingRequests,
    isLoading,
    error,
    fetchPartner,
    fetchPendingRequests,
    sendRequest,
    acceptRequest,
    declineRequest,
  } = useCouplesStore();

  const { files: allFiles } = useMediaStore();
  const { notes } = useNotesStore();

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [partnerUsername, setPartnerUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPartner();
    fetchPendingRequests();
  }, [fetchPartner, fetchPendingRequests]);

  const daysTogether = partner
    ? Math.floor(
        (new Date().getTime() - new Date(partner.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const sharedPhotos = allFiles.length;
  const sharedNotes = notes.length;

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerUsername.trim()) return;

    setIsSubmitting(true);
    try {
      await sendRequest({ partner_username: partnerUsername.trim() });
      toast.success('Запрос отправлен!');
      setShowRequestForm(false);
      setPartnerUsername('');
    } catch {
      toast.error(error || 'Не удалось отправить запрос');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
      toast.success('Вы стали парой! 💕');
    } catch {
      toast.error('Не удалось принять запрос');
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await declineRequest(requestId);
      toast.info('Запрос отклонён');
    } catch {
      toast.error('Не удалось отклонить запрос');
    }
  };

  if (isLoading && !partner) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-romantic-pink" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          Загрузка...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-romantic font-bold text-gray-900 dark:text-white">
          Наша любовь
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Цифровой сад наших отношений
        </p>
      </div>

      {partner ? (
        <div className="space-y-6">
          <div className="card p-8 text-center bg-gradient-to-br from-romantic-pink/10 to-romantic-purple/10 dark:from-romantic-pink/20 dark:to-romantic-purple/20">
            <div className="flex items-center justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-romantic-pink to-romantic-purple p-1">
                {partner.avatar_url ? (
                  <img
                    src={partner.avatar_url}
                    alt={partner.username}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Heart className="h-10 w-10 text-romantic-pink" />
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              @{partner.username}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ваша половинка
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-6 text-center">
              <Heart className="h-8 w-8 mx-auto text-red-500 mb-2" />
              <div className="text-3xl font-bold text-romantic-pink">
                {daysTogether}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Дней вместе
              </div>
            </div>
            <div className="card p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <div className="text-3xl font-bold text-blue-500">
                {new Date(partner.created_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                })}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                День знакомства
              </div>
            </div>
            <div className="card p-6 text-center">
              <Camera className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <div className="text-3xl font-bold text-green-500">
                {sharedPhotos}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Общих фото
              </div>
            </div>
            <div className="card p-6 text-center">
              <MessageCircle className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <div className="text-3xl font-bold text-purple-500">
                {sharedNotes}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Заметок
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4">Статистика любви 💕</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Пройдено пути вместе
                </span>
                <div className="flex-1 mx-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-romantic-pink to-romantic-purple"
                    style={{
                      width: `${Math.min((daysTogether / 365) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {Math.min(Math.round((daysTogether / 365) * 100), 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Любовь к фотографиям
                </span>
                <div className="flex-1 mx-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${Math.min((sharedPhotos / 100) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {Math.min(Math.round((sharedPhotos / 100) * 100), 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Соединитесь со своим партнёром
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Чтобы начать создавать совместные воспоминания, отправьте запрос на
            соединение
          </p>
          <Button
            variant="primary"
            leftIcon={<UserPlus className="h-4 w-4" />}
            onClick={() => setShowRequestForm(true)}
          >
            Отправить запрос
          </Button>
        </div>
      )}

      {pendingRequests.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4">Ожидающие запросы</h3>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium">
                      @{request.initiator.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Check className="h-4 w-4" />}
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    Принять
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<X className="h-4 w-4" />}
                    onClick={() => handleDeclineRequest(request.id)}
                  >
                    Отклонить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showRequestForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md card p-6">
            <h2 className="text-xl font-bold mb-4">
              Отправить запрос на соединение
            </h2>
            <form onSubmit={handleSendRequest} className="space-y-4">
              <Input
                placeholder="Имя пользователя партнёра"
                value={partnerUsername}
                onChange={(e) => setPartnerUsername(e.target.value)}
                leftIcon={<Users className="h-4 w-4" />}
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={<Send className="h-4 w-4" />}
                  isLoading={isSubmitting}
                  className="flex-1"
                >
                  Отправить
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouplesPage;
