import { useAuth } from '@/shared/lib'
import { Avatar, Card, Spinner } from '@/shared/ui'
import { Heart, Calendar, Mail } from 'lucide-react'

export default function ProfilePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-romantic-gradient dark:bg-romantic-gradient-dark">
        <Spinner />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-romantic-gradient dark:bg-romantic-gradient-dark">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-rose-900 dark:text-rose-100">Профиль</h1>

        <Card className="mb-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-rose-300 to-rose-400 shadow-lg">
              <Avatar src={user.avatar_url} size="xl" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-rose-900 dark:text-rose-100">
                {user.username}
              </h2>
              <div className="mt-3 flex flex-col gap-2 text-sm text-rose-600 dark:text-rose-300">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span>Активный участник</span>
                </div>
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <Calendar className="h-4 w-4 text-lavender-500" />
                  <span>С нами с {new Date(user.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-lavender-900/30">
              <Heart className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">∞</p>
              <p className="text-sm text-rose-600 dark:text-rose-300">Воспоминаний</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lavender-100 dark:bg-lavender-900/30">
              <Mail className="h-6 w-6 text-lavender-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-900 dark:text-rose-100">Связь</p>
              <p className="text-xs text-rose-600 dark:text-rose-300">В разработке</p>
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-6 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-rose-500" />
          <p className="text-lg text-rose-700 dark:text-rose-200">
            Спасибо за то, что вы здесь 💕
          </p>
        </Card>
      </div>
    </div>
  )
}
