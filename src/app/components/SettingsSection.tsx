import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type ThemeOption = 'light' | 'dark' | 'system';

const themeLabels: Record<ThemeOption, string> = {
  light: 'Светлая',
  dark: 'Тёмная',
  system: 'Системная',
};

export default function SettingsSection() {
  const { theme, setTheme } = useTheme();

  const currentTheme = (theme as ThemeOption) ?? 'system';

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
    </div>
  );
}
