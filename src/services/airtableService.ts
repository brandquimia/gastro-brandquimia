import Airtable from 'airtable';

const TABLE_NAME = process.env.REACT_APP_AIRTABLE_TABLE_NAME || 'Taberna1830 Reviews';
const VIEW_NAME = process.env.REACT_APP_AIRTABLE_VIEW_ID || 'Grid view';
export const PLACE_ID = process.env.REACT_APP_GOOGLE_PLACE_ID || '';
export const CID = '18214623194210382999'; // El ID de tu negocio en Google Maps

const base = new Airtable({
  apiKey: process.env.REACT_APP_AIRTABLE_API_KEY,
  endpointUrl: 'https://api.airtable.com',
}).base(process.env.REACT_APP_AIRTABLE_BASE_ID!);

export interface GoogleReview {
  id: string;
  businessId: string;
  reviewer: string;
  rating: number;
  content: string;
  date: string;
  response?: string;
  autoResponse?: string;
  reviewUrl?: string;
  status: string;
}

export const airtableService = {
  async getReviewsByBusinessId(businessId: string): Promise<GoogleReview[]> {
    try {
      const records = await base(TABLE_NAME)
        .select({
          view: VIEW_NAME
        })
        .all();

      console.log('Ejemplo de campos:', records[0]?.fields);

      const reviews = records.map(record => {
        const locationId = '18214623194210382999';
        const reviewId = String(record.get('Review ID') || '');
        const googleReviewUrl = `https://business.google.com/reviews/l/${locationId}`;

        return {
          id: record.id,
          businessId: TABLE_NAME,
          reviewer: String(record.get('Reviewer Display Name') || ''),
          rating: record.get('Valoración') as number || 0,
          content: String(record.get('Comment') || ''),
          date: String(record.get('Review Date') || new Date().toISOString()),
          response: String(record.get('Review Reply') || ''),
          reviewUrl: googleReviewUrl,
          status: String(record.get('Status') || 'Nuevo comentario'),
          autoResponse: String(record.get('Auto Response') || '')
        };
      });

      console.log('Reviews procesadas:', reviews);
      return reviews;

    } catch (error) {
      console.error('Error en Airtable:', error);
      throw error;
    }
  }
}; 