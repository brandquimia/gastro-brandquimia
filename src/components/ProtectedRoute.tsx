import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile } from '../services/userService';
import { UserRole } from '../types/user';

const roleHierarchy: Record<UserRole, number> = {
  user: 1,
  admin: 2,
  superAdmin: 3
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole = 'user' 
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (loading) return;

      if (!user) {
        navigate('/login');
        return;
      }

      const userProfile = await getUserProfile(user.uid);
      
      if (!userProfile || roleHierarchy[userProfile.role] < roleHierarchy[requiredRole]) {
        navigate('/unauthorized');
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [user, loading, navigate, requiredRole]);

  if (loading || isLoading) {
    return <div>Cargando...</div>;
  }

  return isAuthorized ? <>{children}</> : null;
}; 