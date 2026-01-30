import { UserDTO } from './common';

export type CoupleRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'EXPIRED';

export interface PartnerDTO extends UserDTO {}

export interface PartnerResponse {
  partner: PartnerDTO | null;
}

export interface CreateCoupleRequest {
  partner_username: string;
}

export interface CoupleRequestDTO {
  id: string;
  created_at: string;
  initiator: PartnerDTO;
  recipient: PartnerDTO;
  status: CoupleRequestStatus;
  accepted_at: string | null;
}

export interface CoupleRequestsResponse {
  requests: CoupleRequestDTO[];
}

export interface CoupleStats {
  daysTogether: number;
  sharedPhotos: number;
  sharedNotes: number;
  sharedAlbums: number;
  anniversaryDate: string | null;
}
