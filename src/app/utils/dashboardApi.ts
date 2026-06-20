import { API_URL } from '../constants/api';
import { ApiError } from './apiError';
import type { AuthenticatedFetch } from './notesApi';

interface DashboardResponse {
  code: string;
  detail: string;
  files_count: number;
  notes_count: number;
  relationship_started_on: string;
}

export interface DashboardStats {
  filesCount: number;
  notesCount: number;
  relationship_started_on: string;
}

export async function getDashboardStats(
  authenticatedFetch: AuthenticatedFetch = fetch,
): Promise<DashboardStats> {
  const response = await authenticatedFetch(`${API_URL}/v1/dashboard`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(error.code, error.detail);
  }

  const data: DashboardResponse = await response.json();
  return {
    filesCount: data.files_count,
    notesCount: data.notes_count,
    relationship_started_on: data.relationship_started_on,
  };
}
