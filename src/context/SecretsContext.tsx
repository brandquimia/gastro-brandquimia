import React, { createContext, useContext, useEffect, useState } from 'react';
import { secretsService } from '../services/secretsService';
import type { Secrets } from '../services/secretsService';

interface SecretsContextType {
  secrets: Secrets | null;
  loading: boolean;
  error: Error | null;
}

const SecretsContext = createContext<SecretsContextType>({
  secrets: null,
  loading: true,
  error: null
});

export const SecretsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [secrets, setSecrets] = useState<Secrets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadSecrets = async () => {
      try {
        const data = await secretsService.getSecrets();
        setSecrets(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadSecrets();
  }, []);

  return (
    <SecretsContext.Provider value={{ secrets, loading, error }}>
      {children}
    </SecretsContext.Provider>
  );
};

export const useSecrets = () => useContext(SecretsContext);