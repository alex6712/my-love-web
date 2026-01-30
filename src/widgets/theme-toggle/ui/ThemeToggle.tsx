import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/shared/store'
import { cn } from '@/shared/lib'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:scale-110 dark:bg-surface-dark',
        className,
      )}
      aria-label="Переключить тему"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-rose-500" />
      ) : (
        <Sun className="h-5 w-5 text-lavender-400" />
      )}
    </button>
  )
}
