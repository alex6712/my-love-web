import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { Loader } from '@/shared/ui/Loader';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
