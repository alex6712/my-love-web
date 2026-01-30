import { type ReactNode } from 'react'
import { cn } from '@/shared/lib'

interface CardProps {
  children: ReactNode
  className?: string
  gradient?: boolean
}

export function Card({ children, className, gradient = false }: CardProps) {
  return (
    <div
      className={cn(
        'card',
        gradient && 'bg-romantic-gradient dark:bg-romantic-gradient-dark',
        className,
      )}
    >
      {children}
    </div>
  )
}
