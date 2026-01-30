import { create } from 'zustand';
import {
  NoteDTO,
  NoteType,
  CreateNoteRequest,
  UpdateNoteRequest,
} from '@/services/types';
import { notesApi } from '@/services';

interface NotesState {
  notes: NoteDTO[];
  isLoading: boolean;
  error: string | null;
  selectedType: NoteType | 'ALL';
  searchQuery: string;
  setNotes: (notes: NoteDTO[]) => void;
  addNote: (note: NoteDTO) => void;
  updateNote: (id: string, data: UpdateNoteRequest) => void;
  deleteNote: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedType: (type: NoteType | 'ALL') => void;
  setSearchQuery: (query: string) => void;
  fetchNotes: () => Promise<void>;
  createNote: (data: CreateNoteRequest) => Promise<NoteDTO>;
  editNote: (id: string, data: UpdateNoteRequest) => Promise<NoteDTO>;
  removeNote: (id: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,
  selectedType: 'ALL',
  searchQuery: '',

  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (id, data) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, ...data } : n)),
    })),
  deleteNote: (id) =>
    set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedType: (selectedType) => set({ selectedType }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await notesApi.getNotes();
      set({ notes: response.notes });
    } catch (error) {
      set({ error: 'Не удалось загрузить заметки' });
    } finally {
      set({ isLoading: false });
    }
  },

  createNote: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const note = await notesApi.createNote(data);
      get().addNote(note);
      return note;
    } catch (error) {
      set({ error: 'Не удалось создать заметку' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  editNote: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const note = await notesApi.updateNote(id, data);
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? note : n)),
      }));
      return note;
    } catch (error) {
      set({ error: 'Не удалось обновить заметку' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeNote: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await notesApi.deleteNote(id);
      get().deleteNote(id);
    } catch (error) {
      set({ error: 'Не удалось удалить заметку' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export const useFilteredNotes = () => {
  const { notes, selectedType, searchQuery } = useNotesStore();
  return notes.filter((note) => {
    const matchesType = selectedType === 'ALL' || note.type === selectedType;
    const matchesSearch =
      searchQuery === '' ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });
};
