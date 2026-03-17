import { KeyRound, Pencil, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

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
  const { user } = useAuth();

  const fallback = user?.username?.charAt(0).toUpperCase() ?? 'U';

  const handleStubAction = (label: string) => {
    toast.info(`${label} станет доступна после добавления endpoint на backend`);
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
              <AvatarImage src={user?.avatar_url ?? undefined} alt={user?.username ?? 'user avatar'} />
              <AvatarFallback className="text-lg">{fallback}</AvatarFallback>
            </Avatar>

            <div>
              <p className="text-lg font-semibold">@{user?.username ?? 'unknown'}</p>
              <p className="text-sm text-muted-foreground">Дата регистрации: {formatRegistrationDate(user?.created_at ?? '')}</p>
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
                onClick={() => handleStubAction(action.label)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {action.label}
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
