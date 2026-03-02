import { API_URL } from '../constants/api';
import type { AuthenticatedFetch } from './notesApi';

interface DashboardResponse {
  code: string;
  detail: string;
  files_count: number;
  notes_count: number;
}

export interface DashboardStats {
  filesCount: number;
  notesCount: number;
}

export async function getDashboardStats(
  authenticatedFetch: AuthenticatedFetch = fetch,
): Promise<DashboardStats> {
  const response = await authenticatedFetch(`${API_URL}/v1/dashboard`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get dashboard stats');
  }

  const data: DashboardResponse = await response.json();
  return {
    filesCount: data.files_count,
    notesCount: data.notes_count,
  };
}
