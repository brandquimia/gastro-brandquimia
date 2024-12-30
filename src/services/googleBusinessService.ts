import { google } from 'googleapis';
import { mybusinessbusinessinformation_v1 } from 'googleapis';

// Interfaces
interface PlaceReview {
  rating: number;
  text: string;
  time: number;
  authorName: string;
}

interface PlaceDetails {
  rating: number;
  reviews: PlaceReview[];
  user_ratings_total: number;
}

type BusinessProfile = mybusinessbusinessinformation_v1.Schema$Location;

// Configuración de autenticación
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.REACT_APP_GOOGLE_PROJECT_ID,
    private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.REACT_APP_GOOGLE_CLIENT_EMAIL,
  },
  scopes: ['https://www.googleapis.com/auth/business.manage']
});

const businessProfile = google.mybusinessbusinessinformation({ version: 'v1', auth });

// Servicio
export const googleBusinessService = {
  async getBusinessProfile(): Promise<BusinessProfile | null> {
    try {
      const accountId = process.env.REACT_APP_GOOGLE_ACCOUNT_ID;
      const locationId = process.env.REACT_APP_GOOGLE_LOCATION_ID;
      
      if (!accountId || !locationId) {
        throw new Error('Missing Google Business Profile configuration');
      }

      const response = await businessProfile.accounts.locations.list({
        parent: `accounts/${accountId}`,
        readMask: 'name,locationName,primaryPhone,profile'
      });

      return response.data.locations?.[0] || null;
    } catch (error) {
      console.error('Error fetching business profile:', error);
      return null;
    }
  },

  async getPlaceDetails(): Promise<PlaceDetails | null> {
    try {
      const placeId = process.env.REACT_APP_GOOGLE_PLACE_ID;
      const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

      if (!placeId || !apiKey) {
        throw new Error('Missing Google Places API configuration');
      }

      // Usar un proxy para evitar CORS
      const response = await fetch(
        `/api/google/places/${placeId}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error fetching place details');
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }
}; 