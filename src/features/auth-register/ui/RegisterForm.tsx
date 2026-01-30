import { useForm } from 'react-hook-form'
import { useRegister } from '../model/useRegister'
import { Button, Input } from '../../../shared/ui'
import { Heart } from 'lucide-react'

interface RegisterFormData {
  username: string
  password: string
  confirmPassword: string
}

export function RegisterForm() {
  const registerMutation = useRegister()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const password = watch('password')

  const onSubmit = (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      return
    }
    registerMutation.mutate({ username: data.username, password: data.password })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-romantic-gradient px-4 dark:bg-romantic-gradient-dark">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
            <Heart className="h-10 w-10 text-rose-500" />
          </div>
          <h1 className="text-center text-3xl font-bold text-rose-900 dark:text-rose-100">
            Создать аккаунт
          </h1>
          <p className="mt-2 text-center text-rose-600 dark:text-rose-300">
            Начните свой цифровой сад
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input
            id="username"
            label="Имя пользователя"
            type="text"
            placeholder="Придумайте имя пользователя"
            error={errors.username?.message}
            {...register('username', {
              required: 'Обязательное поле',
              minLength: { value: 3, message: 'Минимум 3 символа' },
              maxLength: { value: 32, message: 'Максимум 32 символа' },
            })}
          />

          <Input
            id="password"
            label="Пароль"
            type="password"
            placeholder="Придумайте пароль"
            error={errors.password?.message}
            {...register('password', {
              required: 'Обязательное поле',
              minLength: { value: 8, message: 'Минимум 8 символов' },
            })}
          />

          <Input
            id="confirmPassword"
            label="Подтвердите пароль"
            type="password"
            placeholder="Повторите пароль"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Обязательное поле',
              validate: (value) => value === password || 'Пароли не совпадают',
            })}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-rose-600 dark:text-rose-300">
          Уже есть аккаунт?{' '}
          <a href="/login" className="font-semibold text-rose-500 hover:text-rose-700 dark:text-lavender-400 dark:hover:text-lavender-300">
            Войти
          </a>
        </p>
      </div>
    </div>
  )
}