import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Local Marketing', path: '/marketing', icon: '🎯' },
  { name: 'Reputación', path: '/reputation', icon: '⭐' },
  { name: 'Encuestas', path: '/surveys', icon: '📝' },
  { name: 'Informes', path: '/reports', icon: '📈' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  location.pathname === item.path
                    ? 'bg-indigo-600'
                    : 'hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;