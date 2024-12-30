import React, { useEffect, useState } from 'react';
import { googleBusinessService } from '../../services/googleBusinessService';

interface Stats {
  rating: number;
  totalReviews: number;
  ratingCounts: Record<number, number>;
  businessName?: string;
}

export const ReviewsStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [profile, placeDetails] = await Promise.all([
          googleBusinessService.getBusinessProfile(),
          googleBusinessService.getPlaceDetails()
        ]);

        if (!placeDetails) {
          throw new Error('No se pudieron cargar los detalles del negocio');
        }

        const ratingCounts = (placeDetails.reviews || []).reduce((acc, review) => {
          acc[review.rating] = (acc[review.rating] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        setStats({
          rating: placeDetails.rating || 0,
          totalReviews: placeDetails.user_ratings_total || 0,
          ratingCounts,
          businessName: profile?.title || profile?.name || undefined
        });
      } catch (error) {
        setError('Error al cargar las estadísticas');
        console.error(error);
      }
    };

    loadStats();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return <div>Cargando estadísticas...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Valoración promedio</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-3xl font-semibold text-gray-900">
            {stats.rating.toFixed(1)}
          </p>
          <div className="ml-2 flex text-yellow-400 text-xl">★</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Total de reseñas</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {stats.totalReviews}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Distribución</h3>
        {[5, 4, 3, 2, 1].map(rating => (
          <div key={rating} className="flex items-center text-sm">
            <span className="w-8">{rating}★</span>
            <div className="flex-1 mx-2 h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-yellow-400"
                style={{
                  width: `${((stats.ratingCounts[rating] || 0) / stats.totalReviews) * 100}%`
                }}
              />
            </div>
            <span className="w-8 text-right text-gray-500">
              {stats.ratingCounts[rating] || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}; 