import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://default:cG3Xxn8Ra6Ogyg1YqvvsyXE78bzR5Ajq@redis-12405.c261.us-east-1-4.ec2.redns.redis-cloud.com:12405",
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

await redisClient.connect();

export const setValue = async (key: string, value: string): Promise<void> => {
  await redisClient.set(key, value);
};

export const getValue = async (key: string): Promise<string | null> => {
  const value = await redisClient.get(key);
  return value;
};

export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    await redisClient.ping();
    return true;
  } catch (error) {
    console.error("Error checking Redis health:", error);
    return false;
  }
};

export const deleteData = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

export const deletePattern = async (pattern: string): Promise<void> => {
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};

export const setValueWithTTL = async (
  key: string,
  value: string,
  ttlSeconds: number = 300 // 5 minutes default
): Promise<void> => {
  await redisClient.setEx(key, ttlSeconds, value);
};
