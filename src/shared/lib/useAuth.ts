import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/shared/api'
import { useAuthStore } from '@/shared/store'

export function useAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setUser = useAuthStore((state) => state.setUser)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const { data, isLoading, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.me(),
    enabled: isAuthenticated,
    retry: false,
  })

  useEffect(() => {
    if (data?.data?.user) {
      setUser(data.data.user)
    }
  }, [data, setUser])

  useEffect(() => {
    if (error) {
      clearAuth()
    }
  }, [error, clearAuth])

  return {
    user: data?.data?.user || null,
    isLoading,
    isAuthenticated,
    error,
  }
}
