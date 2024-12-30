import { useState, useEffect } from 'react';
import { airtableService, GoogleReview } from '../../services/airtableService';
import { ReviewsList } from '../../components/business/ReviewsList';
import { ReviewsStats } from '../../components/business/ReviewsStats';

export default function ReputationManagement() {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const tableName = process.env.REACT_APP_AIRTABLE_TABLE_NAME || 'Taberna1830 Reviews';

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await airtableService.getReviewsByBusinessId(tableName);
        setReviews(data);
      } catch (error) {
        console.error('Error cargando reseñas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [tableName]);

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestión de Reputación</h1>
        <p className="text-gray-600">Gestiona las reseñas y respuestas de tus negocios</p>
      </div>

      <ReviewsStats />

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Reseñas de {tableName}</h2>
        <ReviewsList reviews={reviews} isLoading={loading} />
      </div>
    </div>
  );
} 