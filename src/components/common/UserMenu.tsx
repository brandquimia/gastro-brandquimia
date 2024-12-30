import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { adminService } from '../../services/adminService';
import { UserRole } from '../../types/user';

const quickUsers = [
  { email: 'superadmin@test.com', role: 'superAdmin' as UserRole },
  { email: 'admin@test.com', role: 'admin' as UserRole },
  { email: 'user@test.com', role: 'user' as UserRole },
];

export const UserMenu = () => {
  const { user, userProfile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuickSwitch = async (role: UserRole) => {
    if (!user?.uid) return;
    try {
      await adminService.updateUserRole(user.uid, role);
      // Redirigir según el nuevo rol
      if (role === 'superAdmin') {
        navigate('/admin/users');
      } else if (role === 'admin') {
        navigate('/admin/businesses');
      } else {
        navigate('/dashboard');
      }
      window.location.reload(); // Recargar para actualizar permisos
    } catch (error) {
      console.error('Error switching role:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
      >
        <span>{userProfile?.email}</span>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
          {userProfile?.role}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="border-t border-gray-100">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500">
              Cambiar rol rápido
            </div>
            {quickUsers.map(({ email, role }) => (
              <button
                key={role}
                onClick={() => handleQuickSwitch(role)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {email} ({role})
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100">
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 