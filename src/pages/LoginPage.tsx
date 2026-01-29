import React from 'react';
import { LoginForm } from '@/features/auth/ui/LoginForm';
import { Heart } from 'lucide-react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-romantic-pink/10 via-white to-romantic-rose/10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="w-full max-w-6xl flex">
        {/* Левая часть - форма */}
        <div className="w-full md:w-1/2 p-8">
          <div className="max-w-md mx-auto">
            <LoginForm />
          </div>
        </div>

        {/* Правая часть - декоративная */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-romantic-pink to-romantic-rose rounded-3xl blur-3xl opacity-20" />
            <div className="relative glass-effect rounded-3xl p-12 backdrop-blur-sm">
              <Heart className="h-32 w-32 text-romantic-heart mx-auto mb-8 heartbeat" />
              <div className="text-center">
                <h2 className="text-3xl font-romantic font-bold text-gray-900 dark:text-white mb-4">
                  Наш личный сад
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Место, где хранятся самые дорогие моменты,
                  <br />
                  самые сокровенные мысли
                  <br />и самые важные мечты.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
