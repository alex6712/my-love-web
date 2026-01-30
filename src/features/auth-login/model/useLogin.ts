import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/shared/api'
import { useAuthStore, useUIStore } from '@/shared/store'

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const addNotification = useUIStore((state) => state.addNotification)

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authApi.login(username, password),
    onSuccess: (response, { username }) => {
      const { access_token, refresh_token } = response.data

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      setAuth(access_token, refresh_token, { id: '', username, avatar_url: null, is_active: true, created_at: '' })

      addNotification('success', 'Добро пожаловать!')
      navigate('/')
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Неверный логин или пароль'
      addNotification('error', message)
    },
  })
}