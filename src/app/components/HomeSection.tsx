import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Image, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from './AuthContext';
import { useAnniversary } from './AnniversaryContext';
import { getDashboardStats } from '../utils/dashboardApi';
import {
  parseLocalDate,
  pluralizeDays,
  getDurationBetween,
  getAvailableFormats,
  stepFormat,
  getEffectiveFormat,
  durationFormatLabels,
  getDurationCardTooltip,
} from '../utils/date';
import { useDateFormat } from './DateFormatContext';
import { FormatToggle } from './ui/format-toggle';

export default function HomeSection() {
  const { user, authenticatedFetch } = useAuth();
  const navigate = useNavigate();
  const { setIsAnniversaryToday } = useAnniversary();

  const [filesCount, setFilesCount] = useState<string>('...');
  const [notesCount, setNotesCount] = useState<string>('...');
  const [relationshipStartedOn, setRelationshipStartedOn] = useState<string | null>(null);
  const [daysUntilAnniversary, setDaysUntilAnniversary] = useState<number | null>(null);
  const [isHoveringToggle, setIsHoveringToggle] = useState(false);
  const { format, setFormat } = useDateFormat();

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [activities, setActivities] = useState([
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
  ]);

  function getDaysUntilNextAnniversary(startDate: string): number | null {
    if (!startDate) {
      return null;
    }
    const start = parseLocalDate(startDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let anniversary = new Date(today.getFullYear(), start.getMonth(), start.getDate());
    if (anniversary < today) {
      anniversary = new Date(today.getFullYear() + 1, start.getMonth(), start.getDate());
    }

    return Math.ceil((anniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

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
        setRelationshipStartedOn(stats.relationship_started_on ?? null);
        setDaysUntilAnniversary(
          stats.relationship_started_on
            ? getDaysUntilNextAnniversary(stats.relationship_started_on)
            : null,
        );
      } catch {
        if (!isMounted) {
          return;
        }

        setFilesCount('—');
        setNotesCount('—');
        setRelationshipStartedOn(null);
      }
    };

    loadDashboardStats();

    return () => {
      isMounted = false;
    };
  }, [authenticatedFetch]);

  useEffect(() => {
    setIsAnniversaryToday(daysUntilAnniversary === 0);
  }, [daysUntilAnniversary, setIsAnniversaryToday]);

  const stats = [
    { label: 'Фотографий', value: filesCount, icon: Image, color: 'text-pink-500' },
    { label: 'Заметок', value: notesCount, icon: MessageCircle, color: 'text-purple-500' },
    { label: 'Моментов счастья', value: '∞', icon: Heart, color: 'text-rose-500' },
  ];

  const durationAvailable = getAvailableFormats(relationshipStartedOn);
  const effectiveFormat = getEffectiveFormat(format, durationAvailable);
  const durationValue = relationshipStartedOn
    ? String(getDurationBetween(relationshipStartedOn, effectiveFormat))
    : '—';
  const durationLabel = relationshipStartedOn
    ? durationFormatLabels[effectiveFormat]
    : 'Дней вместе';

  const cardTooltip = getDurationCardTooltip(durationAvailable, !!relationshipStartedOn);

  const anniversaryActivity =
    daysUntilAnniversary !== null && daysUntilAnniversary <= 30
      ? {
          type: 'anniversary' as const,
          text:
            daysUntilAnniversary === 0
              ? 'Сегодня годовщина знакомства! 🎉'
              : daysUntilAnniversary === 1
                ? 'Завтра годовщина знакомства!'
                : `Годовщина знакомства через ${daysUntilAnniversary} ${pluralizeDays(daysUntilAnniversary)}!`,
          time: 'Напоминание',
          icon: Heart,
        }
      : null;

  const displayedActivities = anniversaryActivity
    ? [anniversaryActivity, ...activities]
    : activities;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl mb-2">Привет, {user?.display_name || `@${user?.username}`}! 💖</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Добро пожаловать в ваш цифровой сад воспоминаний
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.slice(0, 2).map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-lg dark:hover:shadow-[0_4px_24px_rgba(255,255,255,0.06)] transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`w-10 h-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Relationship Duration Card */}
        <Card className="relative group hover:shadow-lg dark:hover:shadow-[0_4px_24px_rgba(255,255,255,0.06)] transition-shadow">
          {cardTooltip && !isHoveringToggle && (
            <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md px-3 py-1.5 w-[100%] text-center z-50 shadow-lg">
              {cardTooltip}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900 dark:border-b-gray-700" />
            </div>
          )}
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{durationLabel}</p>
                <p className="text-2xl mt-1">{durationValue}</p>
              </div>
              <Calendar className="w-10 h-10 text-red-500" />
            </div>
          </CardContent>
          <div
            onMouseEnter={() => setIsHoveringToggle(true)}
            onMouseLeave={() => setIsHoveringToggle(false)}
          >
            <FormatToggle
              availableFormats={durationAvailable}
              currentFormat={effectiveFormat}
              onToggle={() => setFormat(stepFormat(effectiveFormat, durationAvailable))}
            />
          </div>
        </Card>

        {stats.slice(2).map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index + 2}
              className="hover:shadow-lg dark:hover:shadow-[0_4px_24px_rgba(255,255,255,0.06)] transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
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
            {displayedActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 flex items-center justify-between gap-[8px]">
                    <div>
                      <p>{activity.text}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">{activity.time}</p>
                    </div>
                    {activity.type === 'anniversary' && daysUntilAnniversary === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="whitespace-normal min-h-8 h-[100%] shrink-1 mt-2 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 cursor-pointer"
                        onClick={() => navigate('/anniversary')}
                      >
                        Открыть поздравление
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quote */}
      <div className="mt-8 text-center">
        <blockquote className="text-lg italic text-gray-700 dark:text-gray-300">
          "Любовь — это когда счастье другого важнее собственного"
        </blockquote>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">— Неизвестный автор</p>
      </div>
    </div>
  );
}
