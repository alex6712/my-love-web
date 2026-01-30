import { apiClient } from '@/shared/api/api-client';
import {
  PartnerResponse,
  CreateCoupleRequest,
  CoupleRequestsResponse,
  StandardResponse,
} from './types';

export const couplesApi = {
  async getPartner(): Promise<PartnerResponse> {
    return apiClient.get<PartnerResponse>('/v1/couples/partner');
  },

  async createRequest(data: CreateCoupleRequest): Promise<StandardResponse> {
    return apiClient.post<StandardResponse>('/v1/couples/request', data);
  },

  async acceptRequest(couple_id: string): Promise<StandardResponse> {
    return apiClient.post<StandardResponse>(`/v1/couples/${couple_id}/accept`);
  },

  async declineRequest(couple_id: string): Promise<StandardResponse> {
    return apiClient.post<StandardResponse>(`/v1/couples/${couple_id}/decline`);
  },

  async getPendingRequests(): Promise<CoupleRequestsResponse> {
    return apiClient.get<CoupleRequestsResponse>('/v1/couples/pending');
  },
};
