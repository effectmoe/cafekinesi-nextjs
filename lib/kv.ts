import Redis from 'ioredis';

// Redisクライアントのシングルトン
let redis: Redis | null = null;

function getRedisClient(): Redis {
  if (!redis) {
    const redisUrl = process.env.KV_URL || process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('KV_URL or REDIS_URL environment variable is not set');
    }
    redis = new Redis(redisUrl);
  }
  return redis;
}

// @vercel/kv互換のインターフェース
export const kv = {
  async get(key: string): Promise<string | null> {
    const client = getRedisClient();
    return await client.get(key);
  },

  async set(key: string, value: string, options?: { ex?: number }): Promise<void> {
    const client = getRedisClient();
    if (options?.ex) {
      await client.set(key, value, 'EX', options.ex);
    } else {
      await client.set(key, value);
    }
  },

  async setex(key: string, seconds: number, value: string): Promise<void> {
    const client = getRedisClient();
    await client.setex(key, seconds, value);
  },

  async del(key: string): Promise<void> {
    const client = getRedisClient();
    await client.del(key);
  },

  async incr(key: string): Promise<number> {
    const client = getRedisClient();
    return await client.incr(key);
  },

  async expire(key: string, seconds: number): Promise<void> {
    const client = getRedisClient();
    await client.expire(key, seconds);
  },

  async lpush(key: string, value: string): Promise<void> {
    const client = getRedisClient();
    await client.lpush(key, value);
  },

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    const client = getRedisClient();
    return await client.lrange(key, start, stop);
  },

  async keys(pattern: string): Promise<string[]> {
    const client = getRedisClient();
    return await client.keys(pattern);
  },

  async ttl(key: string): Promise<number> {
    const client = getRedisClient();
    return await client.ttl(key);
  }
};
