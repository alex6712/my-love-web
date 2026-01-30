import apiClient from '../client'
import type {
  CreateCoupleRequest,
  StandardResponse,
  PendingRequestsResponse,
  PartnerResponse,
} from '../types/types'

export const couplesApi = {
  getPartner: () => apiClient.get<PartnerResponse>('/couples/partner'),
  createRequest: (data: CreateCoupleRequest) =>
    apiClient.post<StandardResponse>('/couples/request', data),
  acceptRequest: (coupleId: string) =>
    apiClient.post<StandardResponse>(`/couples/${coupleId}/accept`),
  declineRequest: (coupleId: string) =>
    apiClient.post<StandardResponse>(`/couples/${coupleId}/decline`),
  getPendingRequests: () => apiClient.get<PendingRequestsResponse>('/couples/pending'),
}