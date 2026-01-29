import React from 'react';
import { User } from 'lucide-react';
import { classNames } from '@/shared/lib/classNames';

interface UserAvatarProps {
  username?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  username,
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-12 w-12 text-lg',
  };

  if (!username) {
    return (
      <div
        className={classNames(
          'rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center',
          sizes[size],
          className
        )}
      >
        <User
          className={
            size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-6 w-6'
          }
        />
      </div>
    );
  }

  return (
    <div
      className={classNames(
        'rounded-full bg-gradient-to-r from-romantic-pink to-romantic-rose flex items-center justify-center text-white font-medium',
        sizes[size],
        className
      )}
    >
      {username.charAt(0).toUpperCase()}
    </div>
  );
};
