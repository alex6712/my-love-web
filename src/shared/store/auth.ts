import { type UserDTO } from '@/shared/api/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: UserDTO | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (accessToken: string, refreshToken: string, user: UserDTO) => void
  setUser: (user: UserDTO) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      clearAuth: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    },
  ),
)