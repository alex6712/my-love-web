import { useEffect, useState } from 'react';
import { Heart, Calendar, Image, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from './AuthContext';
import { getDashboardStats } from '../utils/dashboardApi';

export default function HomeSection() {
  const { user, authenticatedFetch } = useAuth();
  const [filesCount, setFilesCount] = useState<string>('...');
  const [notesCount, setNotesCount] = useState<string>('...');

  useEffect(() => {
    let isMounted = true;

    const loadDashboardStats = async () => {
      try {
        const stats = await getDashboardStats(authenticatedFetch);
        if (!isMounted) {
          return;
        }

        setFilesCount(String(stats.filesCount));
        setNotesCount(String(stats.notesCount));
      } catch {
        if (!isMounted) {
          return;
        }

        setFilesCount('—');
        setNotesCount('—');
      }
    };

    loadDashboardStats();

    return () => {
      isMounted = false;
    };
  }, [authenticatedFetch]);

  const stats = [
    { label: 'Фотографий', value: filesCount, icon: Image, color: 'text-pink-500' },
    { label: 'Заметок', value: notesCount, icon: MessageCircle, color: 'text-purple-500' },
    { label: 'Дней вместе', value: '∞', icon: Calendar, color: 'text-red-500' },
    { label: 'Моментов счастья', value: '∞', icon: Heart, color: 'text-rose-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl mb-2">Привет, @{user?.username}! 💖</h1>
        <p className="text-gray-600">Добро пожаловать в ваш цифровой сад воспоминаний</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`w-10 h-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Последние моменты</CardTitle>
          <CardDescription>Ваши недавние воспоминания вместе</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: 'photo',
                text: 'Добавлено фото "Закат на пляже"',
                time: '2 часа назад',
                icon: Image,
              },
              {
                type: 'note',
                text: 'Новая заметка "Идеи для выходных"',
                time: '5 часов назад',
                icon: MessageCircle,
              },
              {
                type: 'anniversary',
                text: 'Годовщина знакомства через 10 дней!',
                time: 'Напоминание',
                icon: Heart,
              },
            ].map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p>{activity.text}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quote */}
      <div className="mt-8 text-center">
        <blockquote className="text-lg italic text-gray-700">
          "Любовь — это когда счастье другого важнее собственного"
        </blockquote>
        <p className="text-sm text-gray-500 mt-2">— Неизвестный автор</p>
      </div>
    </div>
  );
}