import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useUIStore } from '@/shared/store'
import { cn } from '@/shared/lib'

export function Notifications() {
  const { notifications, removeNotification } = useUIStore()

  useEffect(() => {
    const timers = notifications.map((n) =>
      setTimeout(() => removeNotification(n.id), 5000),
    )

    return () => timers.forEach(clearTimeout)
  }, [notifications, removeNotification])

  if (notifications.length === 0) return null

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-3">
      {notifications.map((notification) => {
        const icon = {
          success: <CheckCircle className="text-green-500" size={20} />,
          error: <AlertCircle className="text-red-500" size={20} />,
          info: <Info className="text-blue-500" size={20} />,
        }[notification.type]

        const bgClass = {
          success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        }[notification.type]

        return (
          <div
            key={notification.id}
            className={cn(
              'flex items-start gap-3 rounded-2xl border-2 p-4 shadow-lg animate-slide-up',
              bgClass,
            )}
          >
            {icon}
            <div className="flex-1">
              <p className="text-sm font-medium text-rose-900 dark:text-rose-100">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-rose-400 transition-colors hover:text-rose-600 dark:text-rose-300 dark:hover:text-rose-100"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
