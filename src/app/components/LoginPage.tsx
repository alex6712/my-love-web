import { useState } from 'react';
import { Heart, User, Lock } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginData.username, loginData.password);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(registerData.username, registerData.password);
      setRegisterData({ username: '', password: '' });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Heart className="w-20 h-20 text-red-500 fill-red-500" />
              <Heart className="w-8 h-8 text-pink-400 fill-pink-400 absolute top-0 right-0 animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl mb-2">My Love</h1>
          <p className="text-gray-600">Цифровой сад наших отношений</p>
        </div>

        {/* Auth Tabs */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Войти</CardTitle>
                <CardDescription>Добро пожаловать обратно! 💖</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Имя пользователя</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-username"
                        type="text"
                        placeholder="username"
                        className="pl-10"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={isLoading}>
                    {isLoading ? 'Вход...' : 'Войти'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Регистрация</CardTitle>
                <CardDescription>Создайте аккаунт для вашей пары</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Имя пользователя *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="username"
                        className="pl-10"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">От 3 до 32 символов (a-z, A-Z, 0-9, _, -)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Пароль *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">Минимум 12 символов, с цифрой, спецсимволом, верхним и нижним регистром</p>
                  </div>

                  <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={isLoading}>
                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Сделано с ❤️ для одной особенной пары
        </p>
      </div>
    </div>
  );
}
