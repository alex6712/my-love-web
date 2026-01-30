import { Heart, Gift, Lightbulb, Clock, FileText } from 'lucide-react'
import { Button, cn } from '@/shared/ui'
import type { NoteDTO, NoteType } from '@/shared/api'

interface NoteCardProps {
  note: NoteDTO
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

const noteIcons: Record<NoteType[keyof NoteType], JSX.Element> = {
  WISHLIST: <Gift className="text-rose-500" />,
  GRATITUDE: <Heart className="text-rose-500" />,
  IDEA: <Lightbulb className="text-lavender-500" />,
  MEMORY: <Clock className="text-rose-500" />,
  OTHER: <FileText className="text-gray-500" />,
}

const noteLabels: Record<NoteType[keyof NoteType], string> = {
  WISHLIST: 'Желания',
  GRATITUDE: 'Благодарность',
  IDEA: 'Идеи',
  MEMORY: 'Воспоминания',
  OTHER: 'Прочее',
}

export function NoteCard({ note, onEdit, onDelete, className }: NoteCardProps) {
  return (
    <div className={cn('card flex flex-col gap-4', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-lavender-900/30">
            {noteIcons[note.type]}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">
              {note.title || 'Без названия'}
            </h3>
            <span className="text-xs text-rose-400 dark:text-rose-400">
              {noteLabels[note.type]}
            </span>
          </div>
        </div>
        <span className="text-xs text-rose-400 dark:text-rose-400">
          {new Date(note.created_at).toLocaleDateString('ru-RU')}
        </span>
      </div>

      <p className="text-sm text-rose-700 dark:text-rose-200 line-clamp-3">{note.content}</p>

      <div className="flex gap-2">
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
