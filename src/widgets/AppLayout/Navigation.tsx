import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Heart,
  Home,
  Image,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { ThemeSwitcher } from '@/shared/ui/ThemeSwitcher';
import { useAuth } from '@/features/auth';
import { useState } from 'react';

const navigation = [
  { name: 'Главная', href: '/albums', icon: Home },
  { name: 'Альбомы', href: '/albums', icon: Image },
  { name: 'Заметки', href: '/notes', icon: BookOpen },
  { name: 'Профиль', href: '/profile', icon: User },
];

export const Navigation: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Если загрузка, показываем упрощенную навигацию
  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 glass-effect border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center space-x-3">
                <Heart className="h-8 w-8 text-romantic-heart heartbeat" />
                <span className="text-xl font-romantic font-bold text-gray-900 dark:text-white">
                  My Love
                </span>
              </NavLink>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-romantic-heart heartbeat" />
              <span className="text-xl font-romantic font-bold text-gray-900 dark:text-white">
                My Love
              </span>
            </NavLink>
          </div>

          {/* Десктопная навигация */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-romantic-pink/10 text-romantic-pink'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Правая часть */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-xs text-gray-500">
                    {user.is_active ? 'Активен' : 'Не активен'}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-romantic-pink to-romantic-rose flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            <ThemeSwitcher />
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                leftIcon={<LogOut className="h-4 w-4" />}
              >
                Выйти
              </Button>
            )}
          </div>

          {/* Мобильное меню */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Мобильное меню (выпадающее) */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-romantic-pink/10 text-romantic-pink'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                );
              })}
              {user && (
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-romantic-pink to-romantic-rose flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-xs text-gray-500">
                        {user.is_active ? 'Активен' : 'Не активен'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    leftIcon={<LogOut className="h-4 w-4" />}
                  >
                    Выйти
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
