export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api/v1',
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/mylife_os',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'change_me_access',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change_me_refresh',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
  },
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  storage: {
    driver: process.env.STORAGE_DRIVER ?? 'local',
    localPath: process.env.LOCAL_STORAGE_PATH ?? 'uploads',
  },
  seed: {
    ownerEmail: process.env.SEED_OWNER_EMAIL ?? 'cdmanh1108@gmail.com',
    ownerPassword: process.env.SEED_OWNER_PASSWORD ?? '@Manh11082004',
  },
});
