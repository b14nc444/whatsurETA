import { createClient } from 'redis';

type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;
let connectPromise: Promise<RedisClient> | null = null;

const getRedisUrl = (): string => {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error('REDIS_URL is not configured');
  }
  return url;
};

export const getRedisClient = async (): Promise<RedisClient> => {
  if (redisClient?.isOpen) {
    return redisClient;
  }

  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async () => {
    const client = createClient({ url: getRedisUrl() });
    client.on('error', (error) => {
      // eslint-disable-next-line no-console
      console.error('[redis] client error', error);
    });
    await client.connect();
    redisClient = client;
    return client;
  })();

  try {
    return await connectPromise;
  } finally {
    connectPromise = null;
  }
};
