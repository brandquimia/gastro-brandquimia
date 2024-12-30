import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold">GastroRanking</span>
          </div>
          
          <div className="flex items-center">
            <span className="mr-4">{user?.email}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;