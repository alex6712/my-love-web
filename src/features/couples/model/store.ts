import { create } from 'zustand';
import {
  PartnerDTO,
  CoupleRequestDTO,
  CreateCoupleRequest,
} from '@/services/types';
import { couplesApi } from '@/services';

interface CouplesState {
  partner: PartnerDTO | null;
  pendingRequests: CoupleRequestDTO[];
  isLoading: boolean;
  error: string | null;
  daysTogether: number;
  setPartner: (partner: PartnerDTO | null) => void;
  setPendingRequests: (requests: CoupleRequestDTO[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDaysTogether: (days: number) => void;
  fetchPartner: () => Promise<PartnerResponse | null>;
  fetchPendingRequests: () => Promise<void>;
  sendRequest: (data: CreateCoupleRequest) => Promise<void>;
  acceptRequest: (couple_id: string) => Promise<void>;
  declineRequest: (couple_id: string) => Promise<void>;
}

interface PartnerResponse {
  partner: PartnerDTO | null;
}

export const useCouplesStore = create<CouplesState>((set, get) => ({
  partner: null,
  pendingRequests: [],
  isLoading: false,
  error: null,
  daysTogether: 0,

  setPartner: (partner) => set({ partner }),
  setPendingRequests: (pendingRequests) => set({ pendingRequests }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setDaysTogether: (daysTogether) => set({ daysTogether }),

  fetchPartner: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await couplesApi.getPartner();
      set({ partner: response.partner });
      return response;
    } catch (error) {
      set({ error: 'Не удалось загрузить информацию о партнёре' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPendingRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await couplesApi.getPendingRequests();
      set({ pendingRequests: response.requests });
    } catch (error) {
      set({ error: 'Не удалось загрузить запросы' });
    } finally {
      set({ isLoading: false });
    }
  },

  sendRequest: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await couplesApi.createRequest(data);
    } catch (error) {
      set({ error: 'Не удалось отправить запрос' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  acceptRequest: async (couple_id) => {
    set({ isLoading: true, error: null });
    try {
      await couplesApi.acceptRequest(couple_id);
      await get().fetchPartner();
      await get().fetchPendingRequests();
    } catch (error) {
      set({ error: 'Не удалось принять запрос' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  declineRequest: async (couple_id) => {
    set({ isLoading: true, error: null });
    try {
      await couplesApi.declineRequest(couple_id);
      set((state) => ({
        pendingRequests: state.pendingRequests.filter(
          (r) => r.id !== couple_id
        ),
      }));
    } catch (error) {
      set({ error: 'Не удалось отклонить запрос' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
