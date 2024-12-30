import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function getSecret(name: string): Promise<string> {
  const [version] = await client.accessSecretVersion({
    name: `projects/${process.env.GOOGLE_PROJECT_ID}/secrets/${name}/versions/latest`,
  });

  return version.payload?.data?.toString() || '';
}