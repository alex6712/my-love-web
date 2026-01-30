import { forwardRef } from 'react'
import { cn } from '@/shared/lib'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-rose-700 dark:text-rose-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn('input', error && 'border-red-400 focus:border-red-500 focus:ring-red-100', className)}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    )
  },
)

Input.displayName = 'Input'
