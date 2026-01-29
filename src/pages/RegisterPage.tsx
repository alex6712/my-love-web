import React from 'react';
import { RegisterForm } from '@/features/auth/ui/RegisterForm';
import { Heart } from 'lucide-react';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-romantic-pink/10 via-white to-romantic-rose/10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="w-full max-w-6xl flex">
        {/* Левая часть - декоративная */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-romantic-rose to-romantic-heart rounded-3xl blur-3xl opacity-20" />
            <div className="relative glass-effect rounded-3xl p-12 backdrop-blur-sm">
              <Heart className="h-32 w-32 text-romantic-pink mx-auto mb-8 heartbeat" />
              <div className="text-center">
                <h2 className="text-3xl font-romantic font-bold text-gray-900 dark:text-white mb-4">
                  Начните вашу историю
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Каждая великая история начинается с первого шага.<br />
                  Создайте место, которое будет только вашим.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Правая часть - форма */}
        <div className="w-full md:w-1/2 p-8">
          <div className="max-w-md mx-auto">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
