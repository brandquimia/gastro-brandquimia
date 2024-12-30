export interface Secrets {
  FIREBASE_API_KEY: string;
  AIRTABLE_API_KEY: string;
  GOOGLE_API_KEY: string;
  GOOGLE_PRIVATE_KEY: string;
}

export const secretsService = {
  async getSecrets(): Promise<Secrets> {
    try {
      const response = await fetch('/api/secrets');
      if (!response.ok) {
        throw new Error('Error fetching secrets');
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading secrets:', error);
      throw error;
    }
  }
};