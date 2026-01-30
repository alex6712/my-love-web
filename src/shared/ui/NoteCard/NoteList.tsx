import React from 'react';
import { NoteCard } from './index';
import { NoteDTO } from '@/services/types';

interface NoteListProps {
  notes: NoteDTO[];
  onEdit?: (note: NoteDTO) => void;
  onDelete?: (note: NoteDTO) => void;
  compact?: boolean;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  onEdit,
  onDelete,
  compact = false,
}) => {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📝</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Заметки не найдены
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Попробуйте изменить параметры поиска или создайте новую заметку
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
            compact
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
