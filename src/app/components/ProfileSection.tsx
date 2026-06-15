import { useState } from 'react';
import { KeyRound, Pencil, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { API_URL } from '../constants/api';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

const profileActions = [
  { id: 'change-password', label: 'Сменить пароль', icon: KeyRound },
  { id: 'change-avatar', label: 'Сменить аватар', icon: Camera },
  { id: 'change-name', label: 'Сменить имя', icon: Pencil },
];

const formatRegistrationDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Дата недоступна';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate);
};

export default function ProfileSection() {
  const { user, authenticatedFetch } = useAuth();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const fallback = user?.username?.charAt(0).toUpperCase() ?? 'U';

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 12) {
      errors.push('Минимум 12 символов');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Минимум одна заглавная буква');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Минимум одна строчная буква');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Минимум одна цифра');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Минимум один спецсимвол');
    }
    return errors;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors([]);

    const newPassErrors = validatePassword(passwordForm.newPassword);
    if (newPassErrors.length > 0) {
      setPasswordErrors(newPassErrors);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordErrors(['Пароли не совпадают']);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authenticatedFetch(`${API_URL}/v1/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword,
          confirm_password: passwordForm.confirmPassword,
        }),
      });

      if (response.ok) {
        toast.success('Пароль успешно изменён');
        setChangePasswordOpen(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await response.json();
        setPasswordErrors([error.detail || 'Ошибка смены пароля']);
      }
    } catch {
      setPasswordErrors(['Ошибка соединения']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl mb-1">Профиль</h1>
        <p className="text-muted-foreground">Управляйте персональными данными аккаунта</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
          <CardDescription>Данные вашего аккаунта</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage
                src={user?.avatar_url ?? undefined}
                alt={user?.username ?? 'user avatar'}
              />
              <AvatarFallback className="text-lg">{fallback}</AvatarFallback>
            </Avatar>

            <div>
              <p className="text-lg font-semibold">@{user?.username ?? 'unknown'}</p>
              <p className="text-sm text-muted-foreground">
                Дата регистрации: {formatRegistrationDate(user?.created_at ?? '')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Действия с аккаунтом</CardTitle>
          <CardDescription>Временные заглушки до подключения backend endpoint</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {profileActions.map((action) => {
            const Icon = action.icon;

            return (
              <Button
                key={action.id}
                variant="outline"
                className="justify-start"
                onClick={() => {
                  if (action.id === 'change-password') {
                    setChangePasswordOpen(true);
                  } else {
                    toast.info(
                      `${action.label} станет доступна после добавления endpoint на backend`,
                    );
                  }
                }}
              >
                <Icon className="mr-2 h-4 w-4" />
                {action.label}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Смена пароля</DialogTitle>
            <DialogDescription>Введите текущий пароль и придумайте новый</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Текущий пароль</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Новый пароль</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Минимум 12 символов, upper/lower case, цифра, спецсимвол
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Подтвердите пароль</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                required
              />
            </div>
            {passwordErrors.length > 0 && (
              <div className="text-sm text-red-500 space-y-1">
                {passwordErrors.map((error, i) => (
                  <p key={i}>{error}</p>
                ))}
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setChangePasswordOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
