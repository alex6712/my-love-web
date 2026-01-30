import { FileImage, Download, Trash2 } from 'lucide-react'
import { Button, cn } from '@/shared/ui'
import type { FileDTO } from '@/shared/api'

interface FileCardProps {
  file: FileDTO
  onDownload?: () => void
  onDelete?: () => void
  onEdit?: () => void
  className?: string
}

export function FileCard({ file, onDownload, onDelete, onEdit, className }: FileCardProps) {
  const isImage = file.content_type.startsWith('image/')
  const previewUrl = isImage ? `/api/media/files/${file.id}/download` : undefined

  return (
    <div className={cn('card group relative overflow-hidden', className)}>
      <div className="aspect-video overflow-hidden rounded-2xl bg-rose-100 dark:bg-lavender-900/30">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={file.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileImage className="h-12 w-12 text-rose-300 dark:text-lavender-500" />
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100 line-clamp-1">
          {file.title}
        </h3>
        {file.description && (
          <p className="text-sm text-rose-600 dark:text-rose-300 line-clamp-2">{file.description}</p>
        )}
        <p className="text-xs text-rose-400 dark:text-rose-400">
          {new Date(file.created_at).toLocaleDateString('ru-RU')}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        {onDownload && (
          <Button variant="secondary" size="sm" onClick={onDownload}>
            <Download size={16} />
            Скачать
          </Button>
        )}
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Редактировать
          </Button>
        )}
        {onDelete && (
          <Button variant="danger" size="sm" onClick={onDelete}>
            <Trash2 size={16} />
          </Button>
        )}
      </div>
    </div>
  )
}
