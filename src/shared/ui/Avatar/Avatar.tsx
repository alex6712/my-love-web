import { User } from 'lucide-react'
import { cn } from '@/shared/lib'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ src, alt = 'Avatar', size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-16 w-16 text-xl',
    xl: 'h-24 w-24 text-3xl',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn('rounded-full object-cover', sizeClasses[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-rose-300 to-rose-400 text-white dark:from-lavender-400 dark:to-lavender-500',
        sizeClasses[size],
        className,
      )}
    >
      <User size={size === 'sm' ? 16 : size === 'md' ? 24 : size === 'lg' ? 32 : 40} />
    </div>
  )
}
