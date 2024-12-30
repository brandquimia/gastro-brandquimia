import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { roleHierarchy } from '../types/user';

export default function Dashboard() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const handleAddBusiness = () => {
    navigate(userProfile?.role === 'superAdmin' ? '/admin/businesses' : '/businesses');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {roleHierarchy[userProfile?.role || 'user'] >= roleHierarchy.admin && (
        <button
          onClick={handleAddBusiness}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {userProfile?.role === 'superAdmin' ? 'Gestionar Negocios' : 'Mis Negocios'}
        </button>
      )}
    </div>
  );
}