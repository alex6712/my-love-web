import { Navigate } from 'react-router-dom'
import { LoginForm } from '../../../features/auth-login'

export default function LoginPage() {
  const isAuthenticated = localStorage.getItem('access_token')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <LoginForm />
}