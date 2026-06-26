import { useEffect, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useAuth } from './AuthContext';
import { getDashboardStats } from '../utils/dashboardApi';
import { parseLocalDate, pluralizeYears, pluralizeDays } from '../utils/date';

export default function AnniversarySection() {
  const { user, authenticatedFetch } = useAuth();
  const [yearsTogether, setYearsTogether] = useState<number | null>(null);
  const [daysTogether, setDaysTogether] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const stats = await getDashboardStats(authenticatedFetch);
        if (!isMounted || !stats.relationship_started_on) {
          return;
        }

        const start = parseLocalDate(stats.relationship_started_on);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const days = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const years = Math.floor(days / 365);

        if (isMounted) {
          setDaysTogether(days);
          setYearsTogether(years);
        }
      } catch {
        // ignore
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [authenticatedFetch]);

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="w-10 h-10 text-red-500 fill-red-500 animate-pulse" />
          <Sparkles className="w-8 h-8 text-yellow-400" />
          <Heart className="w-10 h-10 text-red-500 fill-red-500 animate-pulse" />
        </div>

        <h1 className="text-4xl md:text-5xl mb-2">С годовщиной, @{user?.username}! 🎉</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Ещё один прекрасный год вместе</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-3 fill-red-500" />
            <p className="text-4xl mb-1">{yearsTogether ?? '...'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {pluralizeYears(yearsTogether ?? 0)} вместе
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <Heart className="w-8 h-8 text-rose-500 mx-auto mb-3" />
            <p className="text-4xl mb-1">{daysTogether ?? '...'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {pluralizeDays(daysTogether ?? 0)} вместе
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <blockquote className="text-lg italic text-gray-700 dark:text-gray-300">
          "С каждым годом я люблю тебя всё сильнее"
        </blockquote>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">— Твоя половинка 💕</p>
      </div>
    </div>
  );
}
