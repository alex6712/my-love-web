import { CreatorDTO } from './common';

export interface CreateAlbumRequest {
  title: string;
  description: string | null;
  cover_url: string | null;
  is_private: boolean;
}

export interface UpdateAlbumRequest {
  title: string;
  description: string | null;
  cover_url: string | null;
  is_private: boolean;
}

export interface AlbumDTO {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  is_private: boolean;
  creator: CreatorDTO;
  items_count?: number;
}

export interface AlbumWithItemsDTO {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  is_private: boolean;
  creator: CreatorDTO;
  items: Array<{
    id: string;
    file_id: string;
    added_at: string;
  }>;
}

export interface AlbumsResponse {
  albums: AlbumDTO[];
}

export interface AlbumResponse {
  album: AlbumWithItemsDTO;
}
