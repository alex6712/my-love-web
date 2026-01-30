import { useAuthStore, useUIStore } from '@/shared/store'
import { authApi } from '@/shared/api'

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const addNotification = useUIStore((state) => state.addNotification)

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      clearAuth()
      addNotification('success', 'До свидания!')
      window.location.href = '/login'
    }
  }

  return { logout }
}