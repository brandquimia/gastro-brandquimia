import React, { useState, useMemo } from 'react';
import { GoogleReview } from '../../services/airtableService';

interface ReviewsListProps {
  reviews: GoogleReview[];
  isLoading: boolean;
}

type SortField = 'date' | 'rating' | 'status';
type SortOrder = 'asc' | 'desc';
type StatusFilter = 'all' | 'pending' | 'responded' | 'ignored';

// O alternativamente, importa directamente de las variables de entorno
const PLACE_ID = process.env.REACT_APP_GOOGLE_PLACE_ID || '';

export const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, isLoading }) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Obtener estados únicos de las reseñas
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(reviews.map(review => review.status));
    return Array.from(statuses);
  }, [reviews]);

  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    if (statusFilter !== 'all') {
      result = result.filter(review => review.status === statusFilter);
    }

    result.sort((a, b) => {
      if (sortField === 'date') {
        return sortOrder === 'desc' 
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortField === 'rating') {
        return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      }
      return sortOrder === 'desc' 
        ? b.status.localeCompare(a.status)
        : a.status.localeCompare(b.status);
    });

    return result;
  }, [reviews, sortField, sortOrder, statusFilter]);

  if (isLoading) return (
    <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filtros y ordenamiento</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-600 mb-1">Ordenar por</label>
            <div className="flex gap-2">
              <select
                className="flex-1 rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={sortField}
                onChange={e => setSortField(e.target.value as SortField)}
              >
                <option value="date">Fecha</option>
                <option value="rating">Valoración</option>
                <option value="status">Estado</option>
              </select>
              <button
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setSortOrder(current => current === 'asc' ? 'desc' : 'asc')}
                title={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-600 mb-1">Estado</label>
            <select
              className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAndSortedReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
            No hay reseñas que coincidan con los filtros seleccionados
          </div>
        ) : (
          filteredAndSortedReviews.map(review => (
            <div key={review.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{review.reviewer}</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                  <a
                    href={review.reviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800 text-sm mt-1"
                  >
                    Ver reseñas en Google
                  </a>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{review.content}</p>
              
              {review.response && (
                <div className="ml-4 mt-2 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-900">Respuesta:</p>
                  <p className="text-gray-700">{review.response}</p>
                </div>
              )}

              <div className="mt-2 flex justify-between items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {review.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 