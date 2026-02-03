import { API_URL } from "../constants/api";

export interface NoteDTO {
  id: string;
  created_at: string;
  type: NoteType;
  title: string;
  content: string;
  creator: {
    id: string;
    username: string;
    avatar_url?: string | null;
  };
}

export type NoteType = "WISHLIST" | "DREAM" | "GRATITUDE" | "MEMORY";

export interface CreateNoteRequest {
  title?: string;
  content: string;
  type: NoteType;
}

export interface UpdateNoteRequest {
  title?: string;
  content: string;
}

export interface NotesResponse {
  code: string;
  detail: string;
  notes: NoteDTO[];
}

export interface NotesWithTotal {
  notes: NoteDTO[];
  total: number;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getNotes(
  type?: NoteType | null,
  offset: number = 0,
  limit: number = 10,
): Promise<NotesWithTotal> {
  let url = `${API_URL}/v1/notes?offset=${offset}&limit=${limit}`;
  if (type) {
    url += `&t=${type}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to get notes");
  }

  const data: NotesResponse = await response.json();
  return { notes: data.notes, total: data.notes.length };
}

export async function createNote(request: CreateNoteRequest): Promise<void> {
  const response = await fetch(`${API_URL}/v1/notes`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create note");
  }
}

export async function updateNote(
  noteId: string,
  request: UpdateNoteRequest,
): Promise<void> {
  const response = await fetch(`${API_URL}/v1/notes/${noteId}`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update note");
  }
}

export async function deleteNote(noteId: string): Promise<void> {
  const response = await fetch(`${API_URL}/v1/notes/${noteId}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to delete note");
  }
}
