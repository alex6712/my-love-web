import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi, type RegisterRequest } from '@/shared/api'
import { useUIStore } from '@/shared/store'

export function useRegister() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((state) => state.addNotification)

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      addNotification('success', 'Регистрация успешна! Теперь вы можете войти.')
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Ошибка при регистрации'
      addNotification('error', message)
    },
  })
}