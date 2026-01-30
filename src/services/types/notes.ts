import { CreatorDTO } from './common';

export type NoteType = 'WISHLIST' | 'DREAM' | 'GRATITUDE' | 'MEMORY';

export interface NoteDTO {
  id: string;
  created_at: string;
  type: NoteType;
  title: string;
  content: string;
  creator: CreatorDTO;
}

export interface NotesResponse {
  notes: NoteDTO[];
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  type: NoteType;
}

export interface UpdateNoteRequest {
  title: string;
  content: string;
}

export const NOTE_TYPE_CONFIG: Record<
  NoteType,
  { label: string; color: string; icon: string }
> = {
  WISHLIST: {
    label: 'Вишлист',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: '🎁',
  },
  DREAM: {
    label: 'Мечта',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    icon: '✨',
  },
  GRATITUDE: {
    label: 'Благодарность',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: '🙏',
  },
  MEMORY: {
    label: 'Воспоминание',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    icon: '💝',
  },
};
