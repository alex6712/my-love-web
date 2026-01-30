import { create } from 'zustand';
import {
  FileDTO,
  AlbumDTO,
  CreateAlbumRequest,
  UpdateAlbumRequest,
} from '@/services/types';
import { mediaApi, albumsApi } from '@/services';

interface MediaState {
  files: FileDTO[];
  albums: AlbumDTO[];
  currentAlbum: AlbumDTO | null;
  isLoading: boolean;
  uploadProgress: Record<string, number>;
  error: string | null;
  viewMode: 'grid' | 'masonry' | 'timeline' | 'list';
  searchQuery: string;
  selectedDate: string;
  setFiles: (files: FileDTO[]) => void;
  setAlbums: (albums: AlbumDTO[]) => void;
  setCurrentAlbum: (album: AlbumDTO | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUploadProgress: (fileId: string, progress: number) => void;
  setViewMode: (mode: 'grid' | 'masonry' | 'timeline' | 'list') => void;
  setSearchQuery: (query: string) => void;
  setSelectedDate: (date: string) => void;
  addFile: (file: FileDTO) => void;
  removeFile: (id: string) => void;
  fetchFiles: () => Promise<void>;
  fetchAlbums: () => Promise<void>;
  fetchAlbum: (id: string) => Promise<AlbumDTO | null>;
  createAlbum: (data: CreateAlbumRequest) => Promise<AlbumDTO>;
  updateAlbum: (id: string, data: UpdateAlbumRequest) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
}

export const useMediaStore = create<MediaState>((set, get) => ({
  files: [],
  albums: [],
  currentAlbum: null,
  isLoading: false,
  uploadProgress: {},
  error: null,
  viewMode: 'grid',
  searchQuery: '',
  selectedDate: '',

  setFiles: (files) => set({ files }),
  setAlbums: (albums) => set({ albums }),
  setCurrentAlbum: (currentAlbum) => set({ currentAlbum }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setUploadProgress: (fileId, progress) =>
    set((state) => ({
      uploadProgress: { ...state.uploadProgress, [fileId]: progress },
    })),
  setViewMode: (viewMode) => set({ viewMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  addFile: (file) => set((state) => ({ files: [file, ...state.files] })),
  removeFile: (id) =>
    set((state) => ({ files: state.files.filter((f) => f.id !== id) })),

  fetchFiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await mediaApi.getFiles();
      set({ files: response.files });
    } catch (error) {
      set({ error: 'Не удалось загрузить файлы' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await albumsApi.getAlbums();
      set({ albums: response.albums });
    } catch (error) {
      set({ error: 'Не удалось загрузить альбомы' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await albumsApi.getAlbum(id);
      set({ currentAlbum: response.album as any });
      return response.album as any;
    } catch (error) {
      set({ error: 'Не удалось загрузить альбом' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  createAlbum: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await albumsApi.createAlbum(data);
      const album = response.album;
      set((state) => ({ albums: [album, ...state.albums] }));
      return album;
    } catch (error) {
      set({ error: 'Не удалось создать альбом' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAlbum: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await albumsApi.updateAlbum(id, data);
      set((state) => ({
        albums: state.albums.map((a) => (a.id === id ? { ...a, ...data } : a)),
        currentAlbum:
          state.currentAlbum?.id === id
            ? { ...state.currentAlbum, ...data }
            : state.currentAlbum,
      }));
    } catch (error) {
      set({ error: 'Не удалось обновить альбом' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await albumsApi.deleteAlbum(id);
      set((state) => ({
        albums: state.albums.filter((a) => a.id !== id),
        currentAlbum: state.currentAlbum?.id === id ? null : state.currentAlbum,
      }));
    } catch (error) {
      set({ error: 'Не удалось удалить альбом' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFile: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await mediaApi.deleteFile(id);
      get().removeFile(id);
    } catch (error) {
      set({ error: 'Не удалось удалить файл' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export const useFilteredFiles = () => {
  const { files, searchQuery, selectedDate } = useMediaStore();
  return files.filter((file) => {
    const matchesSearch =
      searchQuery === '' ||
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);
    const matchesDate =
      !selectedDate || file.created_at.startsWith(selectedDate);
    return matchesSearch && matchesDate;
  });
};

export const useFilesByDate = () => {
  const files = useMediaStore((state) => state.files);
  const grouped: Record<string, FileDTO[]> = {};
  files.forEach((file) => {
    const date = file.created_at.split('T')[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(file);
  });
  return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
};
