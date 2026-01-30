import { apiClient } from '@/shared/api/api-client';
import {
  NotesResponse,
  NoteDTO,
  CreateNoteRequest,
  UpdateNoteRequest,
  StandardResponse,
} from './types';

export const notesApi = {
  async getNotes(): Promise<NotesResponse> {
    return apiClient.get<NotesResponse>('/v1/notes');
  },

  async createNote(data: CreateNoteRequest): Promise<NoteDTO> {
    return apiClient.post<NoteDTO>('/v1/notes', data);
  },

  async updateNote(note_id: string, data: UpdateNoteRequest): Promise<NoteDTO> {
    return apiClient.put<NoteDTO>(`/v1/notes/${note_id}`, data);
  },

  async deleteNote(note_id: string): Promise<StandardResponse> {
    return apiClient.delete<StandardResponse>(`/v1/notes/${note_id}`);
  },
};
