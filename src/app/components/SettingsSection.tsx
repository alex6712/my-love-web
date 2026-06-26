import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from './AuthContext';
import { useDateFormat } from './DateFormatContext';
import { getDashboardStats } from '../utils/dashboardApi';
import { getAvailableFormats, type DurationFormat } from '../utils/date';

type ThemeOption = 'light' | 'dark' | 'system';

const themeLabels: Record<ThemeOption, string> = {
  light: 'Светлая',
  dark: 'Тёмная',
  system: 'Системная',
};

export default function SettingsSection() {
  const { theme, setTheme } = useTheme();
  const { authenticatedFetch } = useAuth();

  const currentTheme = (theme as ThemeOption) ?? 'system';
  const { format, setFormat } = useDateFormat();
  const [relationshipStartedOn, setRelationshipStartedOn] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDate = async () => {
      try {
        const stats = await getDashboardStats(authenticatedFetch);
        if (isMounted) {
          setRelationshipStartedOn(stats.relationship_started_on ?? null);
        }
      } catch {
        if (isMounted) {
          setRelationshipStartedOn(null);
        }
      }
    };

    loadDate();

    return () => {
      isMounted = false;
    };
  }, [authenticatedFetch]);

  const availableFormats = getAvailableFormats(relationshipStartedOn);

  const formatLabels: Record<DurationFormat, string> = {
    days: 'Дни',
    months: 'Месяцы',
    years: 'Годы',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl mb-1">Настройки</h1>
        <p className="text-muted-foreground">Персонализируйте поведение и внешний вид приложения</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Внешний вид</CardTitle>
          <CardDescription>Выберите тему приложения</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="theme-select">Тема приложения</Label>
          <Select value={currentTheme} onValueChange={(value) => setTheme(value as ThemeOption)}>
            <SelectTrigger id="theme-select" className="w-full sm:w-72">
              <SelectValue placeholder="Выберите тему" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(themeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Формат отображения</CardTitle>
          <CardDescription>
            В каком формате показывать время вместе на главном экране
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="format-select">Формат времени вместе</Label>
          <Select value={format} onValueChange={(value) => setFormat(value as DurationFormat)}>
            <SelectTrigger id="format-select" className="w-full sm:w-72">
              <SelectValue placeholder="Выберите формат" />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(formatLabels) as [DurationFormat, string][]).map(
                ([value, label]) => {
                  const isAvailable = availableFormats.includes(value);
                  return (
                    <SelectItem key={value} value={value} disabled={!isAvailable}>
                      <span className={!isAvailable ? 'opacity-40' : ''}>
                        {label}
                        {!isAvailable && (
                          <span className="block text-[10px] opacity-60">
                            будет доступно позже 💕
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  );
                },
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}
