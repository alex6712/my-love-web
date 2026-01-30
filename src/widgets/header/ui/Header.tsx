import { useState } from 'react'
import { Menu, X, Heart } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Avatar, Button } from '@/shared/ui'
import { useAuth, useLogout, cn } from '@/shared/lib'
import { routes } from '@/shared/config'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()
  const { logout } = useLogout()

  const navItems = [
    { path: routes.home, label: 'Главная' },
    { path: routes.albums, label: 'Альбомы' },
    { path: routes.files, label: 'Файлы' },
    { path: routes.notes, label: 'Заметки' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-200 bg-white/80 backdrop-blur-md dark:border-lavender-800 dark:bg-surface-dark/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to={routes.home} className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-500 text-white">
            <Heart className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-rose-900 dark:text-rose-100">My Love</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'text-sm font-medium transition-colors',
                location.pathname === item.path
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-rose-700 hover:text-rose-600 dark:text-rose-300 dark:hover:text-rose-400',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            {user && <Avatar src={user.avatar_url} size="md" />}
            <Link to={routes.profile}>
              <Button variant="ghost" size="sm">
                Профиль
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={logout}>
              Выйти
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Меню"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-rose-600 dark:text-rose-300" />
            ) : (
              <Menu className="h-6 w-6 text-rose-600 dark:text-rose-300" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-rose-200 bg-white px-4 py-4 dark:border-lavender-800 dark:bg-surface-dark md:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'text-sm font-medium',
                  location.pathname === item.path
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-rose-700 dark:text-rose-300',
                )}
              >
                {item.label}
              </Link>
            ))}
            <hr className="border-rose-200 dark:border-lavender-800" />
            <Link
              to={routes.profile}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-rose-700 dark:text-rose-300"
            >
              Профиль
            </Link>
            <Button
              variant="danger"
              size="sm"
              className="w-full"
              onClick={() => {
                logout()
                setMobileMenuOpen(false)
              }}
            >
              Выйти
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}