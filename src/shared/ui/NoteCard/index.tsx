import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { NoteDTO, NOTE_TYPE_CONFIG } from '@/services/types';

interface NoteCardProps {
  note: NoteDTO;
  onEdit?: (note: NoteDTO) => void;
  onDelete?: (note: NoteDTO) => void;
  compact?: boolean;
}

const typeStyles: Record<string, string> = {
  WISHLIST: 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
  DREAM: 'border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20',
  GRATITUDE:
    'border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20',
  MEMORY:
    'border-l-4 border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20',
};

const iconStyles: Record<string, string> = {
  WISHLIST: 'text-blue-500',
  DREAM: 'text-purple-500',
  GRATITUDE: 'text-green-500',
  MEMORY: 'text-yellow-500',
};

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  compact = false,
}) => {
  const config = NOTE_TYPE_CONFIG[note.type];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (compact) {
    return (
      <div
        className={`card p-4 ${typeStyles[note.type]} hover:shadow-md transition-all cursor-pointer`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}
            >
              {config.label}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {formatDate(note.created_at)}
          </span>
        </div>
        <h4 className="font-semibold mt-2 line-clamp-1">{note.title}</h4>
      </div>
    );
  }

  return (
    <div
      className={`card p-6 ${typeStyles[note.type]} hover:shadow-lg transition-all group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-2xl ${iconStyles[note.type]}`}>
            {config.icon}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
          >
            {config.label}
          </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(note)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <Edit className="h-4 w-4 text-gray-500" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(note)}
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
          )}
        </div>
      </div>

      <h3 className="font-bold text-lg mb-2 line-clamp-1">{note.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {note.content}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{formatDate(note.created_at)}</span>
        <span className="text-xs">от @{note.creator.username}</span>
      </div>
    </div>
  );
};
