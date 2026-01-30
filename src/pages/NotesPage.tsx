import React, { useState, useEffect } from 'react';
import { Plus, Search, Grid, List, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { NoteList } from '@/shared/ui/NoteCard/NoteList';
import { NoteForm } from '@/shared/ui/NoteForm';
import { useNotesStore, useFilteredNotes } from '@/features/notes/model/store';
import {
  NoteDTO,
  NoteType,
  CreateNoteRequest,
  UpdateNoteRequest,
} from '@/services/types';
import { toast } from 'sonner';

const NOTE_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  WISHLIST: {
    label: 'Вишлист',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  DREAM: {
    label: 'Мечта',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  },
  GRATITUDE: {
    label: 'Благодарность',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  MEMORY: {
    label: 'Воспоминание',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
};

const NotesPage: React.FC = () => {
  const {
    isLoading,
    error,
    selectedType,
    searchQuery,
    setSelectedType,
    setSearchQuery,
    fetchNotes,
    createNote,
    editNote,
    removeNote,
  } = useNotesStore();

  const filteredNotes = useFilteredNotes();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteDTO | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreateNote = async (
    data: CreateNoteRequest | UpdateNoteRequest
  ) => {
    setIsSubmitting(true);
    try {
      if (editingNote) {
        await editNote(editingNote.id, data as UpdateNoteRequest);
        toast.success('Заметка обновлена');
      } else {
        await createNote(data as CreateNoteRequest);
        toast.success('Заметка создана');
      }
      setShowForm(false);
      setEditingNote(null);
    } catch {
      toast.error(error || 'Произошла ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (note: NoteDTO) => {
    if (confirm('Вы уверены, что хотите удалить эту заметку?')) {
      try {
        await removeNote(note.id);
        toast.success('Заметка удалена');
      } catch {
        toast.error('Не удалось удалить заметку');
      }
    }
  };

  const handleEditNote = (note: NoteDTO) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-romantic font-bold text-gray-900 dark:text-white">
            Заметки
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Ваши мысли, мечты и благодарности
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowForm(true)}
        >
          Новая заметка
        </Button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Поиск заметок..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === 'ALL' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedType('ALL')}
            >
              Все
            </Button>
            {Object.entries(NOTE_TYPE_CONFIG).map(([key, value]) => (
              <Button
                key={key}
                variant={selectedType === key ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedType(key as NoteType)}
              >
                {value.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-romantic-pink" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Загрузка...
          </span>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NoteList
            notes={filteredNotes}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
          />
          <button
            onClick={() => setShowForm(true)}
            className="card border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-romantic-pink hover:bg-romantic-pink/5 transition-colors flex flex-col items-center justify-center p-8"
          >
            <div className="h-12 w-12 rounded-full bg-romantic-pink/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-romantic-pink" />
            </div>
            <p className="font-medium">Создать заметку</p>
            <p className="text-sm text-gray-500 mt-1">Добавить новую заметку</p>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${NOTE_TYPE_CONFIG[note.type].color}`}
                    >
                      {NOTE_TYPE_CONFIG[note.type].label}
                    </span>
                    <h3 className="font-bold text-lg truncate">{note.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {note.content}
                  </p>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(note.created_at).toLocaleDateString('ru-RU')}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    >
                      <Grid className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <List className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <NoteForm
          initialData={editingNote || undefined}
          onSubmit={handleCreateNote}
          onClose={handleCloseForm}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default NotesPage;
