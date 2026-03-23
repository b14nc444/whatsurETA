import { getRedisClient } from '@/lib/redis';

const WINDOW_SEC = 60;
const LIMIT_PER_WINDOW = 20;

const makeRateKey = (key: string): string => {
  const nowWindow = Math.floor(Date.now() / 1000 / WINDOW_SEC);
  return `rl:${key}:${nowWindow}`;
};

export const checkRateLimit = async (key: string): Promise<boolean> => {
  const client = await getRedisClient();
  const redisKey = makeRateKey(key);

  const count = await client.incr(redisKey);
  if (count === 1) {
    await client.expire(redisKey, WINDOW_SEC);
  }

  return count <= LIMIT_PER_WINDOW;
};
