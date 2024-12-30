import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: 'chart-bar',
      roles: ['user', 'admin', 'superAdmin']
    },
    {
      name: 'Negocios',
      path: '/businesses',
      icon: 'building-storefront',
      roles: ['admin', 'superAdmin']
    },
    {
      name: 'Reputación',
      path: '/reputation',
      icon: 'star',
      roles: ['admin', 'superAdmin']
    },
    // ... otros items del menú
  ];

  return (
    <aside className="bg-white border-r w-64 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <i className={`fas fa-${item.icon} w-5 h-5 mr-3`}></i>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}