import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Business } from '../types/auth';
import React from 'react';

const Dashboard = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!user) return;
      
      try {
        const businessesRef = collection(db, 'businesses');
        const q = query(
          businessesRef,
          where('ownerId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const businessList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Business));
        
        setBusinesses(businessList);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [user]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {businesses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            No tienes negocios registrados. ¡Comienza agregando uno!
          </p>
          <button
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={() => {/* TODO: Implementar agregar negocio */}}
          >
            Agregar Negocio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-semibold mb-2">{business.name}</h2>
              <p className="text-gray-600 mb-2">{business.address}</p>
              <p className="text-gray-600">{business.phone}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => {/* TODO: Ver detalles */}}
                >
                  Ver Detalles
                </button>
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => {/* TODO: Gestionar */}}
                >
                  Gestionar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;