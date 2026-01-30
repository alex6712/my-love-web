import { Navigate } from 'react-router-dom'
import { RegisterForm } from '../../../features/auth-register'

export default function RegisterPage() {
  const isAuthenticated = localStorage.getItem('access_token')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <RegisterForm />
}