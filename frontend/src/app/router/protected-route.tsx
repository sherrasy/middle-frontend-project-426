import { Navigate, useLocation } from 'react-router-dom';
import { Loader } from '@/shared/ui/loader';
import { useAuth } from '@/entities/auth';
import { ROUTES } from '@/shared/constants/routes';

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGNIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
