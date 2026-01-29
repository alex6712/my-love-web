import React from 'react';
import { classNames } from '@/shared/lib/classNames';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  className,
  leftIcon,
  rightIcon,
  error,
  ...props
}) => {
  const inputClasses = classNames(
    'w-full px-4 py-2.5 rounded-lg border transition-colors',
    {
      'pl-10': leftIcon,
      'pr-10': rightIcon,
      'border-red-500 focus:border-red-500 focus:ring-red-500': error,
      'border-gray-300 dark:border-gray-600 focus:border-romantic-pink focus:ring-1 focus:ring-romantic-pink':
        !error,
    },
    [
      'bg-white dark:bg-gray-800',
      'text-gray-900 dark:text-gray-100',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      className,
    ].filter(Boolean) as string[]
  );

  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {leftIcon}
        </div>
      )}
      <input className={inputClasses} {...props} />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {rightIcon}
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
