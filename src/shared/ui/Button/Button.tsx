import { type ReactNode } from 'react'
import { cn } from '@/shared/lib'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  type = 'button',
  disabled,
  onClick,
}: ButtonProps) {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-3xl',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn('btn', variantClasses[variant], sizeClasses[size], className)}
    >
      {children}
    </button>
  )
}
