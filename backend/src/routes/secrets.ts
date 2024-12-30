import express from 'express';
import { getSecret } from '../services/secretManager';

const router = express.Router();

router.get('/api/secrets', async (req, res) => {
  try {
    const [
      firebaseApiKey,
      airtableApiKey,
      googleApiKey,
      googlePrivateKey
    ] = await Promise.all([
      getSecret('FIREBASE_API_KEY'),
      getSecret('AIRTABLE_API_KEY'),
      getSecret('GOOGLE_API_KEY'),
      getSecret('GOOGLE_PRIVATE_KEY')
    ]);

    res.json({
      FIREBASE_API_KEY: firebaseApiKey,
      AIRTABLE_API_KEY: airtableApiKey,
      GOOGLE_API_KEY: googleApiKey,
      GOOGLE_PRIVATE_KEY: googlePrivateKey
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching secrets' });
  }
});