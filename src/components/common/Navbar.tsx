import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserMenu } from './UserMenu';
import { roleHierarchy } from '../../types/user';

const Navbar = () => {
  const { user, userProfile } = useAuth();

  const getNavLinks = () => {
    if (!userProfile) return [];

    const links = [
      { to: '/dashboard', label: 'Dashboard', minRole: 'user' }
    ];

    if (roleHierarchy[userProfile.role] >= roleHierarchy.admin) {
      links.push(
        { to: '/businesses', label: 'Mis Negocios', minRole: 'admin' }
      );
    }

    if (roleHierarchy[userProfile.role] >= roleHierarchy.superAdmin) {
      links.push(
        { to: '/admin/businesses', label: 'Gestión de Negocios', minRole: 'superAdmin' },
        { to: '/admin/users', label: 'Gestión de Usuarios', minRole: 'superAdmin' }
      );
    }

    return links;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <span className="text-xl font-semibold">Dashboard</span>
            <div className="flex space-x-4">
              {getNavLinks().map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {user && (
            <div className="flex items-center">
              <UserMenu />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;