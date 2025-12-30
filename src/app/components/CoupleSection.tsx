import { useState, useEffect } from 'react';
import { Heart, UserPlus, Check, X, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';

interface Partner {
  id: string;
  username: string;
  avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
}

interface CoupleRequest {
  id: string;
  initiator: Partner;
  recipient: Partner;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  accepted_at: string | null;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://api.my-love-application.ru';

export default function CoupleSection() {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [requests, setRequests] = useState<CoupleRequest[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [partnerUsername, setPartnerUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPartnerInfo();
    fetchRequests();
  }, []);

  const fetchPartnerInfo = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/v1/couples/partner`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // API возвращает { partner: PartnerDTO | null }
        setPartner(data.partner);
      }
    } catch (error) {
      console.error('Error fetching partner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/v1/couples/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // API возвращает { requests: CoupleRequestDTO[] }
        setRequests(Array.isArray(data.requests) ? data.requests : []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const sendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/v1/couples/request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/v1/couples/${requestId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-700">Ожидание</Badge>;
      case 'ACCEPTED':
        return <Badge className="bg-green-100 text-green-700">Принято</Badge>;
      case 'DECLINED':
        return <Badge className="bg-gray-100 text-gray-700">Отклонено</Badge>;
      case 'EXPIRED':
        return <Badge className="bg-red-100 text-red-700">Истекло</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Heart className="w-12 h-12 text-gray-400 animate-pulse mx-auto mb-2" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-1">Моя пара 💑</h1>
        <p className="text-gray-600">Информация о вашей второй половинке</p>
      </div>

      <div className="space-y-6">
        {/* Partner Info */}
        {partner ? (
          <Card>
            <CardHeader>
              <CardTitle>Ваш партнер</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-gradient-to-br from-pink-400 to-red-400 text-white text-2xl">
                    {partner.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl mb-1">@{partner.username}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>С {new Date(partner.created_at).toLocaleDateString()}</span>
                    </div>
                    {partner.is_active ? (
                      <Badge className="bg-green-100 text-green-700">Активен</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-700">Не активен</Badge>
                    )}
                  </div>
                </div>
                <Heart className="w-12 h-12 text-red-500 fill-red-500" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg mb-2">У вас пока нет пары</h3>
              <p className="text-gray-600 mb-4">Отправьте запрос своему партнеру по его имени пользователя</p>
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
                      <p className="text-xs text-gray-500">
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
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
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
        {partner && (
          <Card>
            <CardHeader>
              <CardTitle>Ваши отношения</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <Calendar className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                  <p className="text-2xl mb-1">∞</p>
                  <p className="text-sm text-gray-600">Дней вместе</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Heart className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl mb-1">∞</p>
                  <p className="text-sm text-gray-600">Воспоминаний</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl mb-1">∞</p>
                  <p className="text-sm text-gray-600">Моментов счастья</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
