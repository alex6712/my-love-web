import { useState, useEffect } from 'react';
import { Heart, UserPlus, Check, X, Calendar, XCircle } from 'lucide-react';
import { useAuth } from './AuthContext';
import { API_URL } from '../constants/api';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarPicker } from './ui/calendar';
import { toast } from 'sonner';

interface Partner {
  id: string;
  created_at: string;
  username: string;
  avatar_url?: string | null;
  is_active: boolean;
}

interface CoupleInfo {
  couple: {
    id: string;
    created_at: string;
    partner: Partner;
    relationship_started_on: string | null;
  } | null;
  detail?: string;
}

interface CoupleRequest {
  id: string;
  created_at: string;
  initiator: Partner;
  recipient: Partner;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  accepted_at: string | null;
}

export default function CoupleSection() {
  const { authenticatedFetch } = useAuth();
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo | null>(null);
  const [requests, setRequests] = useState<CoupleRequest[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [partnerUsername, setPartnerUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isUpdatingDate, setIsUpdatingDate] = useState(false);

  const fetchPartnerInfo = async () => {
    try {
      const response = await authenticatedFetch(`${API_URL}/v1/couples`);

      if (response.ok) {
        const data = await response.json();
        setCoupleInfo(data);
        if (data.couple?.relationship_started_on) {
          setSelectedDate(new Date(data.couple.relationship_started_on));
        }
      }
    } catch (error) {
      console.error('Error fetching partner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await authenticatedFetch(`${API_URL}/v1/couples/pending`);

      if (response.ok) {
        const data = await response.json();
        setRequests(Array.isArray(data.requests) ? data.requests : []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  useEffect(() => {
    fetchPartnerInfo();
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authenticatedFetch(`${API_URL}/v1/couples/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partner_username: partnerUsername }),
      });

      if (response.ok) {
        toast.success('Запрос отправлен! 💌');
        setPartnerUsername('');
        setDialogOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Не удалось отправить запрос');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error('Ошибка при отправке запроса');
    }
  };

  const handleRequest = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      const response = await authenticatedFetch(`${API_URL}/v1/couples/${requestId}/${action}`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success(action === 'accept' ? 'Запрос принят! 💖' : 'Запрос отклонен');
        fetchRequests();
        if (action === 'accept') {
          fetchPartnerInfo();
        }
      } else {
        toast.error('Не удалось обработать запрос');
      }
    } catch (error) {
      console.error('Error handling request:', error);
      toast.error('Ошибка при обработке запроса');
    }
  };

  const updateRelationshipDate = async (date: Date | null) => {
    if (!coupleInfo?.couple?.id) return;

    setIsUpdatingDate(true);
    try {
      const response = await authenticatedFetch(`${API_URL}/v1/couples/${coupleInfo.couple.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relationship_started_on: date ? date.toISOString().split('T')[0] : null,
        }),
      });

      if (response.ok) {
        setCoupleInfo({
          ...coupleInfo,
          couple: {
            ...coupleInfo.couple!,
            relationship_started_on: date ? date.toISOString().split('T')[0] : null,
          },
        });
        toast.success('Дата обновлена');
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Не удалось обновить дату');
      }
    } catch (error) {
      console.error('Error updating date:', error);
      toast.error('Ошибка при обновлении даты');
    } finally {
      setIsUpdatingDate(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
            Ожидание
          </Badge>
        );
      case 'ACCEPTED':
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            Принято
          </Badge>
        );
      case 'DECLINED':
        return (
          <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            Отклонено
          </Badge>
        );
      case 'EXPIRED':
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
            Истекло
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Heart className="w-12 h-12 text-gray-400 animate-pulse mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-1">Моя пара 💑</h1>
        <p className="text-gray-600 dark:text-gray-400">Информация о вашей второй половинке</p>
      </div>

      <div className="space-y-6">
        {/* Partner Info */}
        {coupleInfo?.couple?.partner ? (
          <Card>
            <CardHeader>
              <CardTitle>Ваш партнер</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-gradient-to-br from-pink-400 to-red-400 text-white text-2xl">
                    {coupleInfo.couple.partner.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl mb-1">@{coupleInfo.couple.partner.username}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        С {new Date(coupleInfo.couple.partner.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {coupleInfo.couple.partner.is_active ? (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        Активен
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        Не активен
                      </Badge>
                    )}
                  </div>
                </div>
                <Heart className="w-12 h-12 text-red-500 fill-red-500" />
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Дата начала отношений:
                    </span>
                    <span className="text-sm font-medium">
                      {coupleInfo.couple.relationship_started_on
                        ? new Date(coupleInfo.couple.relationship_started_on).toLocaleDateString(
                            'ru-RU',
                          )
                        : 'Не указана'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" disabled={isUpdatingDate}>
                          <Calendar className="w-4 h-4 mr-1" />
                          {selectedDate ? 'Изменить' : 'Указать дату'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarPicker
                          mode="single"
                          selected={selectedDate || undefined}
                          onSelect={(date) => {
                            setSelectedDate(date || null);
                            updateRelationshipDate(date || null);
                          }}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {coupleInfo.couple.relationship_started_on && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isUpdatingDate}
                        onClick={() => updateRelationshipDate(null)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg mb-2">У вас пока нет пары</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Отправьте запрос своему партнеру по его имени пользователя
              </p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-500 hover:bg-red-600">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Добавить партнера
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Добавить партнера</DialogTitle>
                    <DialogDescription>
                      Отправьте запрос пользователю по его имени пользователя (username)
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={sendRequest} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="partner-username">Имя пользователя партнера</Label>
                      <Input
                        id="partner-username"
                        placeholder="username"
                        value={partnerUsername}
                        onChange={(e) => setPartnerUsername(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Введите имя пользователя (username) вашего партнера
                      </p>
                    </div>
                    <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
                      Отправить запрос
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}

        {/* Pending Requests */}
        {requests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Входящие запросы</CardTitle>
              <CardDescription>Запросы на создание пары</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                          {request.initiator.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">@{request.initiator.username}</p>
                      </div>
                    </div>
                    {request.status === 'PENDING' ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => handleRequest(request.id, 'accept')}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Принять
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRequest(request.id, 'decline')}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Отклонить
                        </Button>
                      </div>
                    ) : (
                      getStatusBadge(request.status)
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Relationship Stats */}
        {coupleInfo?.couple?.partner && (
          <Card>
            <CardHeader>
              <CardTitle>Ваши отношения</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-pink-50 dark:bg-pink-950/30 rounded-lg">
                  <Calendar className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                  <p className="text-2xl mb-1">
                    {coupleInfo.couple.relationship_started_on
                      ? Math.floor(
                          (Date.now() -
                            new Date(coupleInfo.couple.relationship_started_on).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )
                      : '—'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Дней вместе</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <Heart className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl mb-1">—</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Воспоминаний</p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl mb-1">—</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Моментов счастья</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
