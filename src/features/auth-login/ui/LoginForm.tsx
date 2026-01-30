import { useForm } from 'react-hook-form'
import { useLogin } from '../model/useLogin'
import { Button, Input } from '../../../shared/ui'
import { Heart } from 'lucide-react'

interface LoginFormData {
  username: string
  password: string
}

export function LoginForm() {
  const login = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-romantic-gradient px-4 dark:bg-romantic-gradient-dark">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
            <Heart className="h-10 w-10 text-rose-500" />
          </div>
          <h1 className="text-center text-3xl font-bold text-rose-900 dark:text-rose-100">
            Добро пожаловать
          </h1>
          <p className="mt-2 text-center text-rose-600 dark:text-rose-300">
            Войдите в свой цифровой сад
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input
            id="username"
            label="Имя пользователя"
            type="text"
            placeholder="Введите имя пользователя"
            error={errors.username?.message}
            {...register('username', { required: 'Обязательное поле' })}
          />

          <Input
            id="password"
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            error={errors.password?.message}
            {...register('password', {
              required: 'Обязательное поле',
              minLength: { value: 8, message: 'Минимум 8 символов' },
            })}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={login.isPending}
          >
            {login.isPending ? 'Вход...' : 'Войти'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-rose-600 dark:text-rose-300">
          Нет аккаунта?{' '}
          <a href="/register" className="font-semibold text-rose-500 hover:text-rose-700 dark:text-lavender-400 dark:hover:text-lavender-300">
            Зарегистрироваться
          </a>
        </p>
      </div>
    </div>
  )
}