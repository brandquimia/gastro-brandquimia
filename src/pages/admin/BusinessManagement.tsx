import { useState, useEffect } from 'react';
import { businessService } from '../../services/businessService';
import { adminService } from '../../services/adminService';
import { Business } from '../../types/user';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function BusinessManagement() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [newBusiness, setNewBusiness] = useState({
    name: '',
    description: '',
    type: 'restaurant' as const,
    cuisine: [],
    priceRange: '€€' as const,
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    contact: {
      phone: '',
      email: ''
    },
    socialMedia: {},
    businessHours: {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null
    },
    features: [],
    images: {
      gallery: []
    },
    status: 'active' as const
  });
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadBusinesses();
  }, [userProfile]);

  const loadBusinesses = async () => {
    try {
      if (!userProfile) return;
      const data = await businessService.getBusinessesByUser(userProfile.uid);
      setBusinesses(data);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const business = await businessService.createBusiness(newBusiness);
      if (userProfile?.role === 'admin') {
        // Si es admin, asignar el negocio automáticamente
        await adminService.assignBusinessToUser(userProfile.uid, business.id);
      }
      setNewBusiness({
        name: '',
        description: '',
        type: 'restaurant' as const,
        cuisine: [],
        priceRange: '€€' as const,
        location: {
          address: '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        },
        contact: {
          phone: '',
          email: ''
        },
        socialMedia: {},
        businessHours: {
          monday: null,
          tuesday: null,
          wednesday: null,
          thursday: null,
          friday: null,
          saturday: null,
          sunday: null
        },
        features: [],
        images: {
          gallery: []
        },
        status: 'active' as const
      });
      loadBusinesses();
    } catch (error) {
      console.error('Error creating business:', error);
    }
  };

  const handleDelete = async (businessId: string) => {
    try {
      await businessService.deleteBusiness(businessId);
      loadBusinesses();
    } catch (error) {
      console.error('Error deleting business:', error);
    }
  };

  const handleEdit = (businessId: string) => {
    navigate(`/businesses/edit/${businessId}`);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Negocios</h2>
      
      {/* Formulario para crear negocio */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded">
        <div className="flex gap-2">
          <input
            type="text"
            value={newBusiness.name}
            onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
            placeholder="Nombre del negocio"
            className="flex-1 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Crear Negocio
          </button>
        </div>
      </form>

      {/* Lista de negocios */}
      <div className="grid gap-4">
        {businesses.map((business) => (
          <div
            key={business.id}
            className="p-4 border rounded shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{business.name}</h3>
              <p className="text-sm text-gray-600">ID: {business.id}</p>
            </div>
            <div className="flex gap-2">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleEdit(business.id)}
              >
                Editar
              </button>
              {userProfile?.role === 'superAdmin' && (
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(business.id)}
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 