import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { roleHierarchy, UserRole } from '../../types/user';

interface ProtectedRouteProps {
  requiredRole: UserRole;
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole = roleHierarchy[(user.role as UserRole)] >= roleHierarchy[requiredRole];
  
  if (!hasRequiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}; 