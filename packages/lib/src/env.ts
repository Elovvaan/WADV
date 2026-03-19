export const env = {
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  authSecret: process.env.AUTH_SECRET ?? 'dev-secret',
  storageDriver: process.env.STORAGE_DRIVER ?? 'local',
  localStorageDir: process.env.LOCAL_STORAGE_DIR ?? 'uploads',
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
};
