import apiClient from '../client'
import type {
  NotesResponse,
  CreateNoteRequest,
  StandardResponse,
  UpdateNoteRequest,
} from '../types/types'

export const notesApi = {
  getNotes: (params: { offset?: number; limit?: number }) =>
    apiClient.get<NotesResponse>('/notes', { params }),
  createNote: (data: CreateNoteRequest) =>
    apiClient.post<StandardResponse>('/notes', data),
  updateNote: (noteId: string, data: UpdateNoteRequest) =>
    apiClient.put<StandardResponse>(`/notes/${noteId}`, data),
  deleteNote: (noteId: string) =>
    apiClient.delete<StandardResponse>(`/notes/${noteId}`),
}