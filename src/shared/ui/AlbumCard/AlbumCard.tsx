import { Folder, Lock } from 'lucide-react'
import { Button, cn } from '@/shared/ui'
import type { AlbumDTO } from '@/shared/api'

interface AlbumCardProps {
  album: AlbumDTO
  onOpen?: () => void
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

export function AlbumCard({ album, onOpen, onEdit, onDelete, className }: AlbumCardProps) {
  return (
    <div
      className={cn(
        'card group cursor-pointer transition-transform duration-300 hover:scale-[1.02]',
        className,
      )}
      onClick={onOpen}
    >
      <div className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-romantic-gradient dark:bg-romantic-gradient-dark p-6">
        {album.cover_url ? (
          <img
            src={album.cover_url}
            alt={album.title}
            className="h-full w-full rounded-xl object-cover"
            loading="lazy"
          />
        ) : (
          <>
            {album.is_private ? (
              <Lock className="h-16 w-16 text-rose-300 dark:text-lavender-500" />
            ) : (
              <Folder className="h-16 w-16 text-rose-300 dark:text-lavender-500" />
            )}
            <p className="mt-4 text-center text-2xl font-semibold text-rose-700 dark:text-rose-200">
              {album.title}
            </p>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100 line-clamp-1">
            {album.title}
          </h3>
          {album.description && (
            <p className="text-sm text-rose-600 dark:text-rose-300 line-clamp-1">
              {album.description}
            </p>
          )}
          <p className="text-xs text-rose-400 dark:text-rose-400">
            {album.items?.length || 0} файлов
          </p>
        </div>
        {album.is_private && <Lock className="h-5 w-5 text-rose-400" />}
      </div>

      <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Редактировать
          </Button>
        )}
        {onDelete && (
          <Button variant="danger" size="sm" onClick={onDelete}>
            Удалить
          </Button>
        )}
      </div>
    </div>
  )
}
